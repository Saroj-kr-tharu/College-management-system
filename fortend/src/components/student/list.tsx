import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/react-table";
import { useState } from "react";
import toast from "react-hot-toast";
import { getStuOnClass } from "../../api/class.api";
import { deleteStudent, getAllStudents } from "../../api/student.api";
import { useAuth } from "../../context/auth.context";
import TableSkeleton from "../../skeleton/LoadingSkeleton";
import { Role } from "../../types/enum";
import ActionButtons from "../common/table/extra-action-button";
import Table from "../common/table/table";
import ConfirmationModal from "../modal/confirmation.modal";

interface IProps {
  inputValue: string;
  selectedProgram: string;
  selectedSemester: string;
  selectedClass: string;
}

const StudentList: React.FC<IProps> = ({ inputValue, selectedProgram, selectedSemester, selectedClass }) => {
  const [page, setPage] = useState(1);
  const perPage = 5;

  const [show, setShow] = useState(false);
  const [selectedStudent, setselectedStudent] = useState(null);
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["get_all_students", page, inputValue, selectedProgram, selectedSemester, selectedClass],
    queryFn: () => { 
      // When a class is selected, call getStuOnClass instead of getAllStudents
      if (selectedClass) {
        return getStuOnClass(selectedClass, page, perPage);
      }
      // Otherwise fetch all students with the active filters
      return getAllStudents(page, perPage, {
        query: inputValue,
        ...(selectedProgram && { program: selectedProgram }),
        ...(selectedSemester && { semester: selectedSemester }),
      });
    },
  });

  // Delete Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: deleteStudent,
    onSuccess: (response) => {
      toast.success(response.message ?? "Student Deleted");
      queryClient.invalidateQueries({
        queryKey: ["get_all_students"],
        exact: false,
      });
      setShow(false);
    },
    onError: (error) => {
      toast.error(error.message ?? "Student could not be deleted");
    },
  });

  const onDelete = (id: string) => {
    mutate(id);
  };

  const columnHelper = createColumnHelper<any>();

  const columns = [
    columnHelper.accessor("profile", {
      header: () => <span>Profile</span>,
      cell: (info) => {
        return (
          <div className="flex items-center gap-4 justify-center">
            <div className="h-12 w-12 flex-shrink-0">
              <img
                src={info.row.original.profile.path}
                className="h-full w-full object-contain rounded-md border border-gray-200 shadow-sm bg-white p-1"
              />
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("fullName", {
      header: () => <span>Full Name</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("gender", {
      header: () => <span>Gender</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("rollNumber", {
      header: () => <span>Roll No.</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("program", {
      header: () => <span>Program</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("semester", {
      header: () => <span>Semester</span>,
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("courses", {
      header: () => <span>Courses</span>,
      cell: (info) => (
        <span>
          {info
            .getValue()
            ?.map((course: any) => course.name)
            .join(", ") || "-"}
        </span>
      ),
    }),
    columnHelper.accessor("createdAt", {
      header: () => <span>Created At</span>,
      cell: (info) => (
        <span>
          {new Intl.DateTimeFormat("en-us", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }).format(new Date(info.renderValue()))}
        </span>
      ),
    }),
    columnHelper.accessor("updatedAt", {
      header: () => <span>Updated At</span>,
      cell: (info) => (
        <span>
          {new Intl.DateTimeFormat("en-us", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }).format(new Date(info.renderValue()))}
        </span>
      ),
    }),

    user?.role == Role.ADMIN
      ? columnHelper.accessor("_", {
          id: "actions",
          header: () => <span>Actions</span>,
          footer: (info) => info.column.id,
          cell: ({ row: { original } }) => {
            return (
              <ActionButtons
                view_link={`/student/view/${original?._id}`}
                edit_link={`/student/edit/${original?._id}?name=${original.fullName}`}
                onDelete={() => {
                  setselectedStudent(original?._id);
                  setShow(true);
                }}
              />
            );
          },
        })
      : null,
  ].filter(Boolean);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <TableSkeleton />
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-64 bg-white/60 rounded-xl shadow-inner">
        <p className="text-blue-600 font-medium animate-bounce">
          Please Wait...
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="h-full w-full bg-white rounded-sm border-gray-100">
        <div className="h-full w-full overflow-x-auto">
          <Table
            columns={columns}
            data={data?.data}
            pagination={data?.pagination}
            onPageChange={setPage}
          />
        </div>
      </div>
      {show && (
        <ConfirmationModal
          title="Delete Confirmation"
          message="Are you sure you want to remove this student?"
          confirmText="Delete"
          confirmColor="red"
          onCancel={() => setShow(false)}
          onConfirm={() => {
            onDelete(selectedStudent ?? "");
          }}
        />
      )}
    </>
  );
};

export default StudentList;