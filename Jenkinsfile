pipeline{
    agent {label "dev" }

    stages{

        // 1. clone code 
        // 2. trivy scan 
        // 4. restart deployed 
        

        stage("Clone Code"){
           steps{
            git url : "https://github.com/Saroj-kr-tharu/College-management-system", branch :"main"
         } }

        stage("scan file system"){ steps{ 
            sh 'trivy fs . -o result.json'
         } }

        

        stage("docker build and push "){ 
            steps{
                echo "Docker Push Images to docker hub "
                
                withCredentials(  [usernamePassword(
                        credentialsId: "dockerHubCreds",
                        passwordVariable:"dockerHubPass" ,
                        usernameVariable:"dockerHubUser" )]
                    ){
                        sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPass}"

                       
                        // cd  backend docker compose build and push 
                        sh ''' 
                          cd college-management-system-backend 
                          ls
                          docker build -t sarojdockerworkspace/cms-backend:latest .
                          docker push -t sarojdockerworkspace/cms-backend:latest
                          '''
                     
                  
                        // cd fortend , docker compose build and push 

                       
                        sh '''
                          cd college-management-system-frontend/
                          ls 
                          docker build -t sarojdockerworkspace/cms-fortend:latest .
                          docker push -t sarojdockerworkspace/cms-fortend:latest
                         '''
                       

                        
                     }
            } 
         }
        stage("k8s redeployed "){ steps{
             echo " k8s redeployed  "
             sh "kubectl rollout restart deployment backend-dep -n cms-ns"
             sh "kubectl rollout restart deployment fortend-dep -n cms-ns"
         } }
    }

   post {
    success {
        script {
            buildUserVars()
            def user = env.BUILD_USER ?: 'System / Webhook'
            emailext(
                mimeType: 'text/html',
                attachmentsPattern: 'result.json',
                from: 'sarojc11345@gmail.com',
                to: 'sarojc11345@gmail.com',
                subject: "✅ Build Success – ${env.JOB_NAME} ",
                body: """
                <html>
                <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f6f8;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:30px;">
                        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">
                          
                          <tr>
                            <td style="background:#22c55e;color:#ffffff;padding:20px;text-align:center;">
                              <h1 style="margin:0;font-size:24px;">🎉 Build Successful</h1>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:25px;color:#333333;">
                              <p style="font-size:16px;">Your Jenkins build completed successfully.</p>

                              <table width="100%" style="margin-top:15px;font-size:14px;">
                                <tr>
                                  <td><strong>Project</strong></td>
                                  <td>${env.JOB_NAME}</td>
                                </tr>
                                <tr>
                                  <td><strong>Build Number</strong></td>
                                  <td>#${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr>
                                  <td><strong>Triggered By </strong></td>
                                  <td>#${user}</td>
                                </tr>
                                <tr>
                                  <td><strong>Status</strong></td>
                                  <td style="color:#22c55e;font-weight:bold;">${currentBuild.currentResult}</td>
                                </tr>
                              </table>

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
            emailext(
                mimeType: 'text/html',
                attachmentsPattern: 'result.json',
                from: 'sarojc11345@gmail.com',
                to: 'sarojc11345@gmail.com',
                subject: '❌ Build Failed – Todo App',
                body: """
                <html>
                <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f4f6f8;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding:30px;">
                        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);overflow:hidden;">
                          
                          <tr>
                            <td style="background:#ef4444;color:#ffffff;padding:20px;text-align:center;">
                              <h1 style="margin:0;font-size:24px;">🚨 Build Failed</h1>
                            </td>
                          </tr>

                          <tr>
                            <td style="padding:25px;color:#333333;">
                              <p style="font-size:16px;">The Jenkins build has failed. Please review the details below.</p>

                              <table width="100%" style="margin-top:15px;font-size:14px;">
                                <tr>
                                  <td><strong>Project</strong></td>
                                  <td>${env.JOB_NAME}</td>
                                </tr>
                                <tr>
                                  <td><strong>Build Number</strong></td>
                                  <td>#${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr>
                                  <td><strong>Triggered By</strong></td>
                                  <td>#${user}</td>
                                </tr>
                                <tr>
                                  <td><strong>Status</strong></td>
                                  <td style="color:#ef4444;font-weight:bold;">${currentBuild.currentResult}</td>
                                </tr>
                              </table>

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
                              Jenkins CI/CD • Todo App
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

}