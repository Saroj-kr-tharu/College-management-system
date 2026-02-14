pipeline{
    agent {label "dev" }

    stages{

        // 1. clone code 
        // 1.1 sonarqube
        // 1.3 installing dependencies
        // 1.4 owasp dependency check 
        // 2. trivy file scan
        // 2.1 building images 
        // 2.2 push images 
        // 2.3 docker image scan  
        // 4. restart deployed 
        

        stage("Clone Code"){
           steps{
            git url : "https://github.com/Saroj-kr-tharu/College-management-system", branch :"main"
         } }
        
        stage('SonarQube Analysis') {
            steps {
                script {
                    def scannerHome = tool 'SonarQube Scanner'
                    withSonarQubeEnv('SonarQube') {
                        sh """
                            ${scannerHome}/bin/sonar-scanner \
                            -Dsonar.projectKey=cms \
                            -Dsonar.sources=.
                        """
                    }
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage("OWASP Dependency Check"){
          steps{
              script {
                 
                  sh 'mkdir -p dependency-check-report'
                  
                  def dependencyCheckHome = tool 'OWASP Dependency-Check'
                  
                 
                  withCredentials([string(credentialsId: 'NVD_API_KEY', variable: 'NVD_API_KEY')]) {
                      sh """
                          ${dependencyCheckHome}/bin/dependency-check.sh \
                          --scan . \
                          --format XML \
                          --out dependency-check-report \
                          --prettyPrint \
                          --nvdApiKey \${NVD_API_KEY}
                      """
                  }
              }
              
              // Publish the report
              dependencyCheckPublisher pattern: 'dependency-check-report/dependency-check-report.xml'
          }
      }


        stage("scan file system"){ steps{ 
            sh 'trivy fs . -o result.json'
         } }

        stage(" Build Docker Image "){ 
          steps{
             echo " Buildinig Docker Image  "

             withCredentials(  [usernamePassword(
                        credentialsId: "dockerHubCreds",
                        passwordVariable:"dockerHubPass" ,
                        usernameVariable:"dockerHubUser" )]
                    ){
                        sh '''
                          cd college-management-system-backend 
                          docker build -t ${dockerHubUser}/cms-backend:latest .
                        '''

                        sh '''
                          cd college-management-system-frontend/
                          docker build -t ${dockerHubUser}/cms-fortend:latest .
                        '''
                       
                     }
          

              
            } 
         }

        stage("Docker Image Scan") {
          steps {
              withCredentials([usernamePassword(
                  credentialsId: "dockerHubCreds",
                  passwordVariable: "dockerHubPass",
                  usernameVariable: "dockerHubUser"
              )]) {
                  sh '''
                    trivy image --format json -o backend-image-scan.json ${dockerHubUser}/cms-backend:latest
                    trivy image --format json -o frontend-image-scan.json ${dockerHubUser}/cms-fortend:latest
                  '''
              }
          }
      }

        stage("Image Push To DockerHub "){ 
            steps{
                echo "Image Pushing to DockerHub "
                
                withCredentials(  [usernamePassword(
                        credentialsId: "dockerHubCreds",
                        passwordVariable:"dockerHubPass" ,
                        usernameVariable:"dockerHubUser" )]
                    ){
                        sh '''
                          echo "${dockerHubPass}" | docker login -u "${dockerHubUser}" --password-stdin
                          docker push ${dockerHubUser}/cms-backend:latest
                          docker push ${dockerHubUser}/cms-fortend:latest
                        '''
                       
                     }
            } 
         }

        stage("k8s Deployment Restart"){ 
          steps{
             echo " k8s deploymnet restarting  "
             sh "kubectl rollout restart deployment backend-dep -n cms-ns"
             sh "kubectl rollout restart deployment fortend-dep -n cms-ns"
         } }
    }


   post {
    always {
        script {
            archiveArtifacts artifacts: 'trivy-fs-report.json, trivy-fs-report.txt, backend-image-scan.json, backend-image-scan.txt, frontend-image-scan.json, frontend-image-scan.txt, dependency-check-report/*', allowEmptyArchive: true
        }
    }

    success {
        script {
            buildUserVars()
            def user = env.BUILD_USER ?: 'System / Webhook'

            def trivyFsSummary = ''
            def backendScanSummary = ''
            def frontendScanSummary = ''
            
            try {
                trivyFsSummary = readFile('trivy-fs-report.txt').trim()
            } catch(e) {
                trivyFsSummary = 'Report not available'
            }
            
            try {
                backendScanSummary = readFile('backend-image-scan.txt').trim()
            } catch(e) {
                backendScanSummary = 'Report not available'
            }
            
            try {
                frontendScanSummary = readFile('frontend-image-scan.txt').trim()
            } catch(e) {
                frontendScanSummary = 'Report not available'
            }

            emailext(
                mimeType: 'text/html',
                attachmentsPattern: 'trivy-fs-report.json, backend-image-scan.json, frontend-image-scan.json, dependency-check-report/dependency-check-report.html, dependency-check-report/dependency-check-report.xml',
                from: 'sarojc11345@gmail.com',
                to: 'sarojc11345@gmail.com',
                subject: "✅ Build Success – ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                <html>
                <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f6f8;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:30px;">
                        <table width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">
                          
                          <tr>
                            <td style="background:#22c55e;color:#ffffff;padding:20px;text-align:center;">
                              <h1 style="margin:0;font-size:24px;">🎉 Build Successful</h1>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:25px;color:#333333;">
                              <p style="font-size:16px;">Your Jenkins build completed successfully.</p>

                              <table width="100%" style="margin-top:15px;font-size:14px;border-collapse:collapse;">
                                <tr>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Project</strong></td>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${env.JOB_NAME}</td>
                                </tr>
                                <tr>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Build Number</strong></td>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;">#${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Triggered By</strong></td>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${user}</td>
                                </tr>
                                <tr>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Status</strong></td>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;color:#22c55e;font-weight:bold;">${currentBuild.currentResult}</td>
                                </tr>
                              </table>

                              <h2 style="margin-top:30px;font-size:20px;color:#1e293b;border-bottom:2px solid #22c55e;padding-bottom:8px;">📋 Security Scan Reports</h2>
                              
                              <div style="margin-top:15px;background:#f8fafc;border-left:4px solid #3b82f6;padding:15px;border-radius:4px;">
                                <h3 style="margin:0 0 8px 0;color:#1e40af;font-size:16px;">🛡️ OWASP Dependency Check</h3>
                                <p style="margin:0;font-size:13px;color:#64748b;">Full HTML &amp; XML reports attached. View detailed report at:</p>
                                <a href="${env.BUILD_URL}dependency-check-findings/" style="color:#3b82f6;font-size:13px;">OWASP Report in Jenkins</a>
                              </div>

                              <div style="margin-top:15px;background:#f8fafc;border-left:4px solid #8b5cf6;padding:15px;border-radius:4px;">
                                <h3 style="margin:0 0 8px 0;color:#6d28d9;font-size:16px;">📁 Trivy File System Scan</h3>
                                <p style="margin:0 0 8px 0;font-size:13px;color:#64748b;">JSON report attached. Summary:</p>
                                <pre style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:6px;font-size:11px;overflow-x:auto;white-space:pre-wrap;">${trivyFsSummary}</pre>
                              </div>

                              <div style="margin-top:15px;background:#f8fafc;border-left:4px solid #f59e0b;padding:15px;border-radius:4px;">
                                <h3 style="margin:0 0 8px 0;color:#b45309;font-size:16px;">🐳 Docker Image Scan – Backend</h3>
                                <p style="margin:0 0 8px 0;font-size:13px;color:#64748b;">JSON report attached. Summary:</p>
                                <pre style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:6px;font-size:11px;overflow-x:auto;white-space:pre-wrap;">${backendScanSummary}</pre>
                              </div>

                              <div style="margin-top:15px;background:#f8fafc;border-left:4px solid #ec4899;padding:15px;border-radius:4px;">
                                <h3 style="margin:0 0 8px 0;color:#be185d;font-size:16px;">🐳 Docker Image Scan – Frontend</h3>
                                <p style="margin:0 0 8px 0;font-size:13px;color:#64748b;">JSON report attached. Summary:</p>
                                <pre style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:6px;font-size:11px;overflow-x:auto;white-space:pre-wrap;">${frontendScanSummary}</pre>
                              </div>

                              <div style="margin-top:15px;background:#fefce8;border:1px solid #fde047;padding:12px;border-radius:6px;">
                                <p style="margin:0;font-size:13px;color:#854d0e;">📎 <strong>Attached Reports:</strong> trivy-fs-report.json, backend-image-scan.json, frontend-image-scan.json, dependency-check-report.html, dependency-check-report.xml</p>
                              </div>

                              <div style="margin-top:25px;text-align:center;">
                                <a href="${env.BUILD_URL}"
                                   style="background:#22c55e;color:#ffffff;text-decoration:none;
                                          padding:12px 22px;border-radius:6px;
                                          display:inline-block;font-weight:bold;">
                                  View Build Details
                                </a>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td style="background:#f1f5f9;color:#6b7280;
                                       text-align:center;padding:15px;font-size:12px;">
                              Jenkins CI/CD • ${env.JOB_NAME}
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """
            )
        }
    }

    failure {
        script {
            buildUserVars()
            def user = env.BUILD_USER ?: 'System / Webhook'

            def trivyFsSummary = ''
            def backendScanSummary = ''
            def frontendScanSummary = ''
            
            try {
                trivyFsSummary = readFile('trivy-fs-report.txt').trim()
            } catch(e) {
                trivyFsSummary = 'Report not available (stage may not have completed)'
            }
            
            try {
                backendScanSummary = readFile('backend-image-scan.txt').trim()
            } catch(e) {
                backendScanSummary = 'Report not available (stage may not have completed)'
            }
            
            try {
                frontendScanSummary = readFile('frontend-image-scan.txt').trim()
            } catch(e) {
                frontendScanSummary = 'Report not available (stage may not have completed)'
            }

            emailext(
                mimeType: 'text/html',
                attachmentsPattern: 'trivy-fs-report.json, backend-image-scan.json, frontend-image-scan.json, dependency-check-report/dependency-check-report.html, dependency-check-report/dependency-check-report.xml',
                from: 'sarojc11345@gmail.com',
                to: 'sarojc11345@gmail.com',
                subject: "❌ Build Failed – ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                <html>
                <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f6f8;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:30px;">
                        <table width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">
                          
                          <tr>
                            <td style="background:#ef4444;color:#ffffff;padding:20px;text-align:center;">
                              <h1 style="margin:0;font-size:24px;">🚨 Build Failed</h1>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:25px;color:#333333;">
                              <p style="font-size:16px;">The Jenkins build has failed. Please review the details below.</p>

                              <table width="100%" style="margin-top:15px;font-size:14px;border-collapse:collapse;">
                                <tr>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Project</strong></td>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${env.JOB_NAME}</td>
                                </tr>
                                <tr>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Build Number</strong></td>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;">#${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Triggered By</strong></td>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;">${user}</td>
                                </tr>
                                <tr>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;"><strong>Status</strong></td>
                                  <td style="padding:8px;border-bottom:1px solid #e5e7eb;color:#ef4444;font-weight:bold;">${currentBuild.currentResult}</td>
                                </tr>
                              </table>

                              <h2 style="margin-top:30px;font-size:20px;color:#1e293b;border-bottom:2px solid #ef4444;padding-bottom:8px;">📋 Security Scan Reports (Available)</h2>
                              
                              <div style="margin-top:15px;background:#f8fafc;border-left:4px solid #3b82f6;padding:15px;border-radius:4px;">
                                <h3 style="margin:0 0 8px 0;color:#1e40af;font-size:16px;">🛡️ OWASP Dependency Check</h3>
                                <p style="margin:0;font-size:13px;color:#64748b;">Reports attached if stage completed. View at:</p>
                                <a href="${env.BUILD_URL}dependency-check-findings/" style="color:#3b82f6;font-size:13px;">OWASP Report in Jenkins</a>
                              </div>

                              <div style="margin-top:15px;background:#f8fafc;border-left:4px solid #8b5cf6;padding:15px;border-radius:4px;">
                                <h3 style="margin:0 0 8px 0;color:#6d28d9;font-size:16px;">📁 Trivy File System Scan</h3>
                                <pre style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:6px;font-size:11px;overflow-x:auto;white-space:pre-wrap;">${trivyFsSummary}</pre>
                              </div>

                              <div style="margin-top:15px;background:#f8fafc;border-left:4px solid #f59e0b;padding:15px;border-radius:4px;">
                                <h3 style="margin:0 0 8px 0;color:#b45309;font-size:16px;">🐳 Docker Image Scan – Backend</h3>
                                <pre style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:6px;font-size:11px;overflow-x:auto;white-space:pre-wrap;">${backendScanSummary}</pre>
                              </div>

                              <div style="margin-top:15px;background:#f8fafc;border-left:4px solid #ec4899;padding:15px;border-radius:4px;">
                                <h3 style="margin:0 0 8px 0;color:#be185d;font-size:16px;">🐳 Docker Image Scan – Frontend</h3>
                                <pre style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:6px;font-size:11px;overflow-x:auto;white-space:pre-wrap;">${frontendScanSummary}</pre>
                              </div>

                              <div style="margin-top:15px;background:#fef2f2;border:1px solid #fca5a5;padding:12px;border-radius:6px;">
                                <p style="margin:0;font-size:13px;color:#991b1b;">📎 <strong>Attached Reports (if available):</strong> trivy-fs-report.json, backend-image-scan.json, frontend-image-scan.json, dependency-check-report.html, dependency-check-report.xml</p>
                              </div>

                              <div style="margin-top:25px;text-align:center;">
                                <a href="${env.BUILD_URL}"
                                   style="background:#ef4444;color:#ffffff;text-decoration:none;
                                          padding:12px 22px;border-radius:6px;
                                          display:inline-block;font-weight:bold;">
                                  View Failure Logs
                                </a>
                              </div>
                            </td>
                          </tr>

                          <tr>
                            <td style="background:#f1f5f9;color:#6b7280;
                                       text-align:center;padding:15px;font-size:12px;">
                              Jenkins CI/CD • ${env.JOB_NAME}
                            </td>
                          </tr>

                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """
            )
        }
    }
    }

// ...existing code...

}