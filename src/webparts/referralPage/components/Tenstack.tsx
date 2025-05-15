import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Web } from "sp-pnp-js";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import "./Style.css";
import * as moment from "moment";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Panel, PanelType } from "@fluentui/react/lib/Panel";
import { FaAngleUp } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import Swal from "sweetalert2";
import Sidenavbar from "./Sidenavbar";

const Tenstack = (props: any) => {
  // const testurl = "https://smalsusinfolabs.sharepoint.com/sites/IITIQ";
  //const teststudentid = "74B7FEF6-020F-4F64-8DE4-338FBAEF2687";

  const testurl = props?.props?.context?._pageContext?.web?.absoluteUrl;
  const teststudentid = props?.props?.StudentReferalId;
    const testidfeeStructure = props?.props?.FeeStructureListId;

  const currentUrl = window.location.href;
  const match = currentUrl.match(/sites\/([^/]+)/);
  const siteName = match ? match[1] : "IITIQ"; // fallback to iitiq

  const [data, setData] = React.useState<any[]>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnFilters, setColumnFilters] = React.useState<
    { id: string; value: string }[]
  >([]);

  const [isopenmodal, setIsopenmodal] = React.useState(false);
  const [formdata, setFormdata] = React.useState({
    Title: "",
    Email: "",
    PhoneNumber: "",
    CallSchedule: "",
    Status: "",
    Response: "",
    Author: "",
    Source: "",
    Course: "",
    Comments: "",
  });

  // const [comment,setComment]=React.useState([{
  //   CurrDate:"",
  //   Msg:""
  // }])

  const [editindex, setEditindex] = React.useState(null);
  const [selectedStatus, setSelectedStatus] = React.useState("");

  const [createdtitle, setCreatedtitle] = React.useState();
  const [createdtitletime, setCreatedtitletime] = React.useState();

  const [modifiedtitle, setModifiedtitle] = React.useState();
  const [modifiedtitletime, setModifiedtitletime] = React.useState();

  const [comments, setComments] = React.useState<any[]>([]);
  const [newComment, setNewComment] = React.useState("");

  const [phoneError, setPhoneError] = React.useState("");

  const [editCommentIndex, setEditCommentIndex] = React.useState<number | null>(
    null
  );
  const [editedCommentText, setEditedCommentText] = React.useState<string>("");

  // const [courseOptions, setCourseOptions] = React.useState<string[]>([]);

  const [feesturcture, setFeestructure] = React.useState<any[]>([]);

  const handleSaveEditedComment = (index: number) => {
    const updatedComments = [...comments];
    updatedComments[index].Msg = editedCommentText;
    updatedComments[index].Time = new Date().toLocaleString(); // update timestamp
    setComments(updatedComments);
    setEditCommentIndex(null);
    setEditedCommentText("");
  };

  const fetchApidata = async () => {
    try {
      const web = new Web(testurl);
      const res = await web.lists
        .getById(teststudentid)
        .items.select("*,Author/Title,Editor/Title")
        .expand("Author,Editor")
        .getAll();

      const processedData = res.map((item: any) => ({
        ...item,
        Comments: JSON.parse(item.Comments),
      }));
      setData(processedData);

      // const uniqueCourses = Array.from(
      //   new Set(processedData.map((item) => item.Course).filter(Boolean))
      // );
      // setCourseOptions(uniqueCourses);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchApidata();
  }, []);

  console.log("total data", data);



  ///////////////////fee structure

   const fetchApidata4 = async () => {
    try {
      const web = new Web(testurl);
      const res = await web.lists
        .getById(testidfeeStructure)
        .items.select("*,Subjects/Id,Subjects/Title")
        .expand("Subjects")
        .getAll();
      setFeestructure(res);
     
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchApidata4();
  }, []);

  const handlePost = () => {
    if (newComment.trim() === "") return; // Prevent empty comments

    const newEntry = {
      Msg: newComment,
      Time: new Date().toLocaleString(),
    };

    setComments([...comments, newEntry]);
    setNewComment(""); // Clear input for next comment
  };

  const handleDeleteComment = (index: number) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    setComments(updatedComments);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  // Filter Data Based on Selected Status
  const filteredData = selectedStatus
    ? data.filter((item) => item.Status === selectedStatus)
    : data;

  const columns = [
    {
      header: "Name",
      accessorKey: "Title",
    },
    {
      header: "Course",
      accessorKey: "Course",
    },
    {
      header: "Number",
      accessorKey: "PhoneNumber",
      accessorFn: (row: any) =>
        String(row.PhoneNumber != null ? row.PhoneNumber : ""),
    },
    // {
    //   header: "Email",
    //   accessorKey: "Email",
    //   accessorFn: (row: any) => String(row.Email != null ? row.Email : ""),
    // },
    {
      header: "Call ",
      accessorKey: "CallSchedule",
      accessorFn: (row: any) =>
        row.CallSchedule ? moment(row.CallSchedule).format("DD/MM/YYYY") : "",

      // cell: (info: any) => {
      //   const rawDate = info.getValue();
      //   return rawDate
      //     ? moment(rawDate).format("DD/MM/YYYY hh:mm:ss A")
      //     : "N/A";
      // },
    },

    {
      header: () => (
        <select
          style={{ fontSize: "12px" }}
          className="form-select"
          value={selectedStatus}
          onChange={handleStatusChange}
        >
          <option value="">Select Status</option>
          <option value="New">New</option>
          <option value="Joined">Joined</option>
          {siteName === "TSO" ? (
            <option value="Interview-Schedule">Interview-Schedule</option>
          ) : (
            <option value="Connected">Connected</option>
          )}
          <option value="Not Interested">Not Interested</option>
          <option value="Follow-Up">Follow-Up</option>
        </select>
      ),
      accessorKey: "Status",
    },

    {
  header: "Latest Comments ",
  accessorFn: (row: any) => {
    const response = row.Response || "";
    const comments = row.Comments;
    
    if (Array.isArray(comments) && comments.length > 0) {
      const latestComment = comments[comments.length - 1]?.Msg || "";
      return latestComment;
    }

    return response;
  },
},


//     {
//   header: "Response / Latest Comment",
//   accessorFn: (row: any) => {
//     const response = row.Response || "";
//     const comments = row.Comments;
//     let latestComment = "";

//     if (Array.isArray(comments) && comments.length > 0) {
//       latestComment = comments[comments.length - 1]?.Msg || "";
//     }

//     // Merge both response and latest comment
//     return `${response}${response && latestComment ? " | " : ""}${latestComment}`;
//   },
// },

    // {
    //   header: "Response",
    //   accessorKey: "Response",
    // },
//     {
//   header: "Latest Comment",
//   accessorKey: "Comments",
//   accessorFn: (row: any) => {
//     const comments = row.Comments;
//     if (Array.isArray(comments) && comments.length > 0) {
//       return comments[comments.length - 1].Msg; // latest comment
//     }
//     return "";
//   },
// },

    {
      header: "Source",
      accessorKey: "Source",
    },
    {
      header: "Reffered by",
      accessorKey: "Author.Title",
    },
    // {
    //   header: "Created",
    //   accessorKey: "Created",
    //   accessorFn: (row: any) =>
    //     row.Created ? moment(row.Created).format("DD/MM/YYYY") : "",
    //   // cell: (info: any) => {
    //   //   const CDate = info.getValue();
    //   //   return CDate ? moment(CDate).format("DD/MM/YYYY ") : "N/A";
    //   // },
    // },

    {
      header: "Actions",
      cell: ({ row }: any) => {
        const item = row.original; // Access the row's original data
        return (
          <td>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                className="btn"
                onClick={() => {
                  handleedit(item);
                  openModal();
                }}
              >
                <FaRegEdit style={{ color: "green" }} />
              </button>
              <button className="btn" onClick={() => handledelete(item.Id)}>
                <MdDelete style={{ color: "red" }} />
              </button>
            </div>
          </td>
        );
      },
    },
  ];

  const tabledata = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      // pagination: { pageIndex: 0, pageSize: 8 },
      sorting: [],
    },
  });

  const handledelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure Delete Item",
      text: "You want to delete this data",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const web = new Web(testurl);
          await web.lists
            .getById(teststudentid)
            .items.getById(id)
            .delete()
            .then(() => {
              const remaindata = data.filter((item) => item.id != id);
              setData(remaindata);
              fetchApidata();
              Swal.fire({
                title: "Deleted!",
                text: "The item has been deleted successfully.",
                icon: "success",
              });
            });
        } catch (error) {
          console.log("data in not delete");

          Swal.fire({
            title: "Error!",
            text: "Something went wrong. The item could not be deleted.",
            icon: "error",
          });
        }
      }
    });
  };

  const openModal = () => setIsopenmodal(true);
  const closeModal = () => {
    setFormdata({
      Title: "",
      Email: "",
      PhoneNumber: "",
      CallSchedule: "",
      Status: "",
      Response: "",
      Author: "",
      Course: "",
      Source: "",
      Comments: "",
    });
    setIsopenmodal(false);
    setEditindex(null);
    setComments([]);
    setNewComment("");
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormdata((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));

    setPhoneError("");
  };

  const handleedit = (item: any) => {
    setEditindex(item.Id);
    const selecteditem = item;
    setFormdata({
      Title: selecteditem?.Title || "",
      Email: selecteditem?.Email || "",
      PhoneNumber: selecteditem?.PhoneNumber || "",
      CallSchedule:
        selecteditem?.CallSchedule !== null
          ? moment(selecteditem?.CallSchedule).format("YYYY-MM-DD")
          : "",
      Status: selecteditem?.Status || "",
      Response: selecteditem?.Response || "",
      Author: selecteditem?.Author?.Title || "",
      Course: selecteditem?.Course || "",
      Source: selecteditem?.Source || "",
      Comments: selecteditem?.Comments || "",
    });

    if (item.Comments && Array.isArray(item.Comments)) {
      setComments(item.Comments);
    } else {
      setComments([]); // Set to empty array if no comments exist
    }
    setCreatedtitle(selecteditem.Author.Title);
    setCreatedtitletime(selecteditem.Created);

    setModifiedtitle(selecteditem.Editor.Title);
    setModifiedtitletime(selecteditem.Modified);
    setIsopenmodal(true);
  };

  const handlesumbit = async (e: any) => {
    e.preventDefault();

    try {
      let web = new Web(testurl);

      if (editindex === null) {
        // Query the list for items with the same PhoneNumber
        const existingItems = await web.lists
          .getById(teststudentid)
          .items.filter(`PhoneNumber eq '${formdata.PhoneNumber}'`)
          .get();

        if (existingItems.length > 0) {
          setPhoneError("Phone number already exists!");
          return; // Do not proceed with saving
        }
      }

      if (editindex !== null) {
        await web.lists
          .getById(teststudentid)
          .items.getById(editindex)
          .update({
            CallSchedule: formdata?.CallSchedule || null,
            Status: formdata?.Status || "",
            Response: formdata?.Response || null,
            Course: formdata?.Course || "",
            Source: formdata?.Source || "",
            Comments: JSON.stringify(comments) || "",
          })
          .then((res) => {
            setIsopenmodal(false);
            setEditindex(null);
            setFormdata({
              Title: "",
              Email: "",
              PhoneNumber: "",
              CallSchedule: "",
              Status: "",
              Response: "",
              Author: "",
              Course: "",
              Source: "",
              Comments: "",
            });
            Swal.fire({
              title: "Success!",
              text: "The record has been updated successfully.",
              icon: "success",
            });
          });
        fetchApidata();
      } else {
        await web.lists
          .getById(teststudentid)
          .items.add({
            Title: formdata.Title || "",
            Email: formdata.Email || "",
            PhoneNumber: formdata.PhoneNumber || null,
            CallSchedule: formdata?.CallSchedule || null,
            Status: formdata?.Status || "",
            Response: formdata?.Response || null,
            Course: formdata?.Course || null,
            Source: formdata?.Source || "",
            Comments: JSON.stringify(comments) || "",
          })
          .then((res) => {
            setIsopenmodal(false);
            setEditindex(null);
            setComments([]);
            setFormdata({
              Title: "",
              Email: "",
              PhoneNumber: "",
              CallSchedule: "",
              Status: "",
              Response: "",
              Author: "",
              Course: "",
              Source: "",
              Comments: "",
            });
            Swal.fire({
              title: "Success!",
              text: "The record has been updated successfully.",
              icon: "success",
            });
          });
        fetchApidata();
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating the record.",
        icon: "error",
      });
    }
  };

  //////////////fotter
  // const onRenderFooterContent = React.useCallback(
  //   () => (
  //     <div>
  //       <div className="d-flex justify-content-between">
  //         {editindex !== null && (
  //           <div>
  //             <p>
  //               created {moment(createdtitletime).format("DD MMM YYYY")} by{" "}
  //               {createdtitle}
  //             </p>
  //             <div className="d-flex">
  //               <p>
  //                 Modified {moment(modifiedtitletime).format("DD MMM YYYY")} by{" "}
  //                 {modifiedtitle}
  //               </p>
  //               <p>
  //                 <a
  //                   className="linkurl"
  //                   href={`https://smalsusinfolabs.sharepoint.com/sites/IITIQ/Lists/StudentReferrals/EditForm.aspx?ID=${editindex}`}
  //                   target="_blank"
  //                 >
  //                   Open out of the box-form
  //                 </a>
  //               </p>
  //             </div>
  //           </div>
  //         )}
  //         <div className="text-end">
  //           <button
  //             type="button"
  //             className="btn btn-secondary"
  //             onClick={closeModal}
  //           >
  //             Close
  //           </button>
  //           {editindex == null ? (
  //             <button
  //               type="submit"
  //               onClick={handlesumbit}
  //               className="btn btn-primary m-3"
  //             >
  //               Save
  //             </button>
  //           ) : (
  //             <button
  //               type="submit"
  //               onClick={handlesumbit}
  //               className="btn btn-primary m-3"
  //             >
  //               Update
  //             </button>
  //           )}
  //         </div>
  //       </div>
  //     </div>
  //   ),
  //   [closeModal, handlesumbit]
  // );
  const onRenderFooterContent = React.useCallback(
    () => (
      <div >
        {editindex == null ? (
          <div className="text-end">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              Close
            </button>
            {editindex == null ? (
              <button
                type="submit"
                onClick={handlesumbit}
                className="btn btn-primary m-3"
              >
                Save
              </button>
            ) : (
              <button
                type="submit"
                onClick={handlesumbit}
                className="btn btn-primary m-3"
              >
                Update
              </button>
            )}
          </div>
        ) : (
          <div className="d-flex justify-content-between">
            {editindex !== null && (
              <div>
                <p>
                  created{" "}
                  <span style={{ color: "blue" }}>
                    {moment(createdtitletime).format("DD MMM YYYY")}
                  </span>{" "}
                  by <span style={{ color: "blue" }}> {createdtitle}</span>
                </p>
                <div className="d-flex">
                  <p>
                    Modified{" "}
                    <span style={{ color: "blue" }}>
                      {moment(modifiedtitletime).format("DD MMM YYYY")}
                    </span>{" "}
                    by <span style={{ color: "blue" }}> {modifiedtitle}</span>
                  </p>
                  <p>
                    <a
                      className="linkurl"
                      href={`https://smalsusinfolabs.sharepoint.com/sites/IITIQ/Lists/Students/EditForm.aspx?ID=${editindex}`}
                      target="_blank"
                    >
                      Open out of the box-form
                    </a>
                  </p>
                </div>
              </div>
            )}
            <div className="text-end">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
              {editindex == null ? (
                <button
                  type="submit"
                  onClick={handlesumbit}
                  className="btn btn-primary m-3"
                >
                  Save
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handlesumbit}
                  className="btn btn-primary m-3"
                >
                  Update
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    ),
    [closeModal, handlesumbit]
  );

  return (
    <>
      <div className="bg">
        <div className="d-flex gap-3">
          <div>
            <Sidenavbar />
          </div>
          <div className="w-100">
            <h1 className="text-center  pt-1 text-light">Referral Page</h1>
            <div className="space">
              <input
                type="text"
                className="form-control"
                placeholder="Search across all columns..."
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
              />
            </div>
            <div className="m-1 bg-light table-container">
              <div className="p-1 d-flex justify-content-between">
                <div className="mt-2 ps-1">
                  Showing {filteredData.length} of total {data.length}
                </div>
                <button className="btn btn-primary" onClick={openModal}>
                  Add Student
                </button>
              </div>
              <table className="table table-striped table-bordered table-hover bg-light ">
                {/* <colgroup>
                  <col />
                  <col  />
                  <col  style={{ width: "100px" }} />
                  <col style={{ width: "100px" }} />
                  <col style={{ width: "100px" }} />
                  <col />
                  <col style={{ width: "100px" }}/>
                  <col style={{ width: "100px" }} />
                </colgroup> */}
                <thead>
                  {tabledata.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id}>
                          {/* {header.column.id == 'Status'&&
                   <div>
                  { header.column.id == 'Status'&&flexRender(
                    header.column.columnDef.header,
                    header.getContext() 
                  )}
                  </div>
                    } */}
                          <div className="d-flex ">
                            <div>
                              {header.column.getCanFilter() &&
                              header.column.id !== "Status" ? (
                                <input
                                  type="text"
                                  style={{
                                    height: "32px",
                                    fontSize: "13px",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                  placeholder={` ${header.column.columnDef.header}`}
                                  value={
                                    (header.column.getFilterValue() as string) ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    header.column.setFilterValue(e.target.value)
                                  }
                                  className="form-control mt-1"
                                />
                              ) : (
                                <div
                                  style={{
                                    marginRight: "15px",
                                    marginBottom: "5px",
                                  }}
                                >
                                  {header.column.id == "Status" &&
                                    flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                </div>
                              )}
                            </div>
                            <div
                              style={{
                                alignItems: "center",
                                cursor: "pointer",
                                color: "#97999b",
                                marginLeft: "-20px",
                              }}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {header.column.id !== "Actions" &&
                              header.column.id !== "Status" ? (
                                header.column.getIsSorted() === "asc" ? (
                                  <FaAngleUp />
                                ) : (
                                  <FaAngleUp />
                                )
                              ) : (
                                ""
                              )}
                              <br />
                              {header.column.id !== "Actions" &&
                              header.column.id !== "Status" ? (
                                header.column.getIsSorted() === "desc" ? (
                                  <FaAngleDown style={{ marginTop: "-12px" }} />
                                ) : (
                                  <FaAngleDown style={{ marginTop: "-12px" }} />
                                )
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {tabledata.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* <div className="pagination">
        <button
        className='btn btn-primary '
          onClick={() => tabledata.previousPage()}
          disabled={!tabledata.getCanPreviousPage()}
        >
          Previous
        </button>
        <span style={{marginTop:"8px"}}>
          Page {tabledata.getState().pagination.pageIndex + 1} of{' '}
          {tabledata.getPageCount()}
        </span>
        <button
        className='btn btn-primary '
          onClick={() => tabledata.nextPage()}
          disabled={!tabledata.getCanNextPage()}
        >
          Next
        </button>
      </div> */}
            </div>
          </div>
        </div>

        <div>
          {isopenmodal && (
            <Panel
              isOpen={isopenmodal}
              onDismiss={closeModal}
              onRenderFooterContent={onRenderFooterContent}
              type={PanelType.medium}
            >
              <div className="form-label">
                {editindex == null ? (
                  <div>
                    <h5>Form Details</h5>
                    <form onSubmit={handlesumbit}>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Name</label>
                            <input
                              type="text"
                              className="form-control mt-2"
                              name="Title"
                              value={formdata?.Title}
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Email</label>
                            <input
                              type="text"
                              className="form-control mt-2"
                              name="Email"
                              value={formdata?.Email}
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Phone Number</label>
                            <input
                              type="text"
                              className="form-control mt-2"
                              name="PhoneNumber"
                              value={formdata?.PhoneNumber}
                              onChange={handleChange}
                              autoComplete="off"
                              maxLength={10}
                            />
                            {phoneError && (
                              <small style={{ color: "red" }}>
                                {phoneError}
                              </small>
                            )}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Call Schedule</label>
                            <input
                              type="date"
                              className="form-control mt-2"
                              name="CallSchedule"
                              value={moment(formdata?.CallSchedule).format(
                                "YYYY-MM-DD"
                              )}
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Course</label>
                            {/* <input
                              type="text"
                              className="form-control mt-2"
                              name="Course"
                              value={formdata?.Course}
                              onChange={handleChange}
                              autoComplete="off"
                            /> */}

                            <select
                              className="form-select mt-2"
                              name="Course"
                              value={formdata?.Course}
                              onChange={handleChange}
                            >
                              <option value="">Select Course</option>
                              {feesturcture.map((el) => (
                                <option key={el} value={el.Title}>
                                  {el.Title}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group m-2 ">
                            <label>Sources</label>

                            <select
                              className="form-select  mt-2"
                              name="Source"
                              value={formdata.Source} // Current selected stream
                              onChange={handleChange} // Handle change event
                            >
                              <option value="" disabled>
                                Select a Source
                              </option>
                              <option value="Sales">Sales</option>
                              <option value="Basu">Basu</option>
                              <option value="JD">JD</option>
                            </select>
                          </div>
                        </div>

                        {/* <div className="col-lg-12">
                          <div className="form-group m-2">
                            <label>Response</label>
                            <textarea
                              rows={4}
                              className="form-control mt-2"
                              name="Msg"
                              value={comment[0].Msg}
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </div>
                        </div> */}

                        {/* <button
                type="submit"
                onClick={handlecomment}
                className="btn btn-primary m-3"
              >
                post

              </button> */}

                        {/* <div className="col-lg-12">
                          <div className="form-group m-2">
                            <label>Response</label>
                            <textarea
                              rows={2}
                              className="form-control mt-2"
                              name="Response"
                              value={formdata?.Response}
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </div>
                        </div> */}

                        <div className=" col-lg-12">
                          <label htmlFor="">Comments</label>

                          {comments.map((comment: any) => (
                            <div
                              key={comment.id}
                              className="mb-2 p-2 bg-white border rounded"
                            >
                              <p>{comment.Msg}</p>
                              <span className="text-xs text-gray-500">
                                {comment.Time}
                              </span>
                            </div>
                          ))}

                          <div className="form-group m-2">
                            <textarea
                              rows={3}
                              className="form-control mt-2 w-full p-2 border rounded"
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              autoComplete="off"
                            ></textarea>
                          </div>

                          <button
                            type="button"
                            onClick={handlePost}
                            className="btn btn-success m-3"
                          >
                            Post
                          </button>
                        </div>

                        <div className="col-lg-12">
                          <div className="form-group m-2">
                            <label>Status</label>
                            <div className="stream-options mt-2">
                              <label>
                                <input
                                  type="radio"
                                  name="Status"
                                  value="New"
                                  className="mx-2"
                                  checked={formdata?.Status === "New"}
                                  onChange={handleChange}
                                />
                                <span>New</span>
                              </label>

                              {siteName === "TSO" ? (
                                <label>
                                  <input
                                    type="radio"
                                    name="Status"
                                    value="Interview-Schedule"
                                    className="mx-2"
                                    checked={
                                      formdata?.Status === "Interview-Schedule"
                                    }
                                    onChange={handleChange}
                                  />
                                  <span>Interview-Schedule</span>
                                </label>
                              ) : (
                                <label>
                                  <input
                                    type="radio"
                                    name="Status"
                                    value="Connected"
                                    className="mx-2"
                                    checked={formdata?.Status === "Connected"}
                                    onChange={handleChange}
                                  />
                                  <span>Connected</span>
                                </label>
                              )}

                              <label>
                                <input
                                  type="radio"
                                  name="Status"
                                  value="Follow-Up"
                                  className="mx-2"
                                  checked={formdata?.Status === "Follow-Up"}
                                  onChange={handleChange}
                                />
                                <span>Follow-UP</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="Status"
                                  value="Not Interested"
                                  className="mx-2"
                                  checked={
                                    formdata?.Status === "Not Interested"
                                  }
                                  onChange={handleChange}
                                />
                                <span>Not Interested</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="Status"
                                  value="Joined"
                                  className="mx-2"
                                  checked={formdata?.Status === "Joined"}
                                  onChange={handleChange}
                                />
                                <span>Joined</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    {editindex == null ? (
                      <button type="submit" className="btn btn-primary m-3">
                        Save
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary m-3">
                        Update
                      </button>
                    )}
                  </div> */}
                      </div>
                    </form>
                  </div>
                ) : (
                  <div>
                    <h5>Form Details</h5>
                    <form onSubmit={handlesumbit}>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Name</label>
                            <input
                              type="text"
                              className="form-control mt-2"
                              name="Title"
                              value={formdata?.Title}
                              onChange={handleChange}
                              autoComplete="off"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Reffered By</label>
                            <input
                              type="text"
                              className="form-control mt-2"
                              name="Author"
                              value={formdata?.Author}
                              onChange={handleChange}
                              autoComplete="off"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Email</label>
                            <input
                              type="text"
                              className="form-control mt-2"
                              name="Email"
                              value={formdata?.Email}
                              onChange={handleChange}
                              autoComplete="off"
                              disabled
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Phone Number</label>
                            <input
                              type="text"
                              className="form-control mt-2"
                              name="PhoneNumber"
                              value={formdata?.PhoneNumber}
                              onChange={handleChange}
                              autoComplete="off"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Course</label>
                            <input
                              type="text"
                              className="form-control mt-2"
                              name="Course"
                              value={formdata?.Course}
                              onChange={handleChange}
                              autoComplete="off"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group m-2 ">
                            <label>Sources</label>

                            <select
                              className="form-select  mt-2"
                              name="Source"
                              value={formdata.Source} // Current selected stream
                              onChange={handleChange} // Handle change event
                            >
                              <option value="" disabled>
                                Select a Source
                              </option>
                              <option value="Sales">Sales</option>
                              <option value="Basu">Basu</option>
                              <option value="JD">JD</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group m-2">
                            <label>Call Schedule</label>
                            <input
                              type="date"
                              className="form-control mt-2"
                              name="CallSchedule"
                              value={moment(formdata?.CallSchedule).format(
                                "YYYY-MM-DD"
                              )}
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        {/* <div className="col-lg-12">
                          <div className="form-group m-2">
                            <label>Response</label>
                            <textarea
                              rows={2}
                              className="form-control mt-2"
                              name="Response"
                              value={formdata?.Response}
                              onChange={handleChange}
                              autoComplete="off"
                            />
                          </div>
                        </div> */}

                        {/* <div className="mt-4">
                        <label htmlFor="">Comments</label>

                          {comments.length === 0 ? (
                            <p className="text-gray-500">No comments yet.</p>
                          ) : (
                            comments.map((comment: any, index) => (
                              <div
                                key={index}
                                className="mb-2 p-2 bg-white border rounded"
                              >
                                <p>{comment.Msg}</p>
                                <span className="text-xs text-gray-500">
                                  {comment.Time}
                                </span>
                              </div>
                            ))
                          )}
                        </div> */}

                        <div className=" col-lg-12">
                          <label htmlFor="">Comments</label>

                          <div className="form-group m-2">
                            <textarea
                              rows={3}
                              className="form-control mt-2 w-full p-2 border rounded"
                              placeholder="Write a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              autoComplete="off"
                            ></textarea>
                          </div>

                          <button
                            type="button"
                            onClick={handlePost}
                            className="btn btn-success m-3"
                          >
                            Post
                          </button>
                        </div>

                        <div className="mt-4">
                          {comments.length === 0 ? (
                            <p className="text-gray-500">No comments yet.</p>
                          ) : (
                            comments.map((comment: any, index: number) => (
                              <div
                                key={index}
                                className="mb-2 p-2 bg-white border rounded"
                              >
                                {editCommentIndex === index ? (
                                  <>
                                    <textarea
                                      className="form-control mb-2"
                                      value={editedCommentText}
                                      onChange={(e) =>
                                        setEditedCommentText(e.target.value)
                                      }
                                    />
                                    <div className="flex">
                                      <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={() =>
                                          handleSaveEditedComment(index)
                                        }
                                      >
                                        Post
                                      </button>
                                      <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() =>
                                          setEditCommentIndex(null)
                                        }
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <p>{comment.Msg}</p>
                                    <span className="text-xs text-gray-500 d-block">
                                      {comment.Time}
                                    </span>
                                    <FaRegEdit
                                      style={{
                                        color: "green",
                                        fontSize: "17px",
                                      }}
                                      onClick={() => {
                                        setEditCommentIndex(index);
                                        setEditedCommentText(comment.Msg);
                                      }}
                                    />
                                    {/* <button
                                      className="btn btn-sm btn-outline-primary mt-1"
                                      onClick={() => {
                                        setEditCommentIndex(index);
                                        setEditedCommentText(comment.Msg);
                                      }}
                                    >
                                      Edit
                                    </button> */}
                                    <MdDelete
                                      style={{
                                        color: "red",
                                        fontSize: "17px",
                                        marginLeft: "10px",
                                      }}
                                      onClick={() => handleDeleteComment(index)}
                                    />
                                    {/* <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => handleDeleteComment(index)}
                                    >
                                      Delete
                                    </button> */}
                                  </>
                                )}
                              </div>
                            ))
                          )}
                        </div>
                        <div className="col-lg-12">
                          <div className="form-group m-2">
                            <label>Status</label>
                            <div className="stream-options mt-2">
                              <label>
                                <input
                                  type="radio"
                                  name="Status"
                                  value="New"
                                  className="mx-2"
                                  checked={formdata?.Status === "New"}
                                  onChange={handleChange}
                                />
                                <span>New</span>
                              </label>
                              {siteName === "TSO" ? (
                                <label>
                                  <input
                                    type="radio"
                                    name="Status"
                                    value="Interview-Schedule"
                                    className="mx-2"
                                    checked={
                                      formdata?.Status === "Interview-Schedule"
                                    }
                                    onChange={handleChange}
                                  />
                                  <span>Interview-Schedule</span>
                                </label>
                              ) : (
                                <label>
                                  <input
                                    type="radio"
                                    name="Status"
                                    value="Connected"
                                    className="mx-2"
                                    checked={formdata?.Status === "Connected"}
                                    onChange={handleChange}
                                  />
                                  <span>Connected</span>
                                </label>
                              )}
                              <label>
                                <input
                                  type="radio"
                                  name="Status"
                                  value="Follow-Up"
                                  className="mx-2"
                                  checked={formdata?.Status === "Follow-Up"}
                                  onChange={handleChange}
                                />
                                <span>Follow-UP</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="Status"
                                  value="Not Interested"
                                  className="mx-2"
                                  checked={
                                    formdata?.Status === "Not Interested"
                                  }
                                  onChange={handleChange}
                                />
                                <span>Not Interested</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="Status"
                                  value="Joined"
                                  className="mx-2"
                                  checked={formdata?.Status === "Joined"}
                                  onChange={handleChange}
                                />
                                <span>Joined</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                    {editindex == null ? (
                      <button type="submit" className="btn btn-primary m-3">
                        Save
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-primary m-3">
                        Update
                      </button>
                    )}
                  </div> */}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
};

export default Tenstack;
