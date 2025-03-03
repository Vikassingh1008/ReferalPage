import * as React from 'react';
import {  Web} from "sp-pnp-js";
import './Style.css';
import * as moment from 'moment';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Panel, PanelType} from '@fluentui/react/lib/Panel';
import 'bootstrap/dist/css/bootstrap.min.css';

const TenStackTable = () => {

    const testurl="https://smalsusinfolabs.sharepoint.com/sites/IITIQ";
    const teststudentid="74B7FEF6-020F-4F64-8DE4-338FBAEF2687";

  // Sample data for the table
  
  // State for table data and features
  const [data, setData] = React.useState<any[]>([]);
  const [search, setSearch] =React.useState('');
  const [sortConfig, setSortConfig] = React.useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const rowsPerPage = 8;
  

   const [isopenmodal,setIsopenmodal]=React.useState(false);
      const [formdata,setFormdata]=React.useState({
          Title:"",
          Email:"",
          PhoneNumber:"",
          CallSchedule:"",
          Status:"",
          Response:"",
          // Author:""
      });
  
      const [editindex,setEditindex]=React.useState(null);
      const [selectedStatus, setSelectedStatus] = React.useState('');
  
      const handleStatusChange = (e:any) => {
        setSelectedStatus(e.target.value);
      };
  
  
   const fetchApidata = async () => {
          try {
              const web = new Web(testurl);
              const res = await web.lists.getById(teststudentid).items.select("Id","Title","Email","PhoneNumber","CallSchedule","Status","Response","Author/Title","Created").expand("Author").get();
              setData(res);  
          } catch (error) {
              console.error("Error fetching data:", error);
          }
      };
      
      React.useEffect(() => {
          fetchApidata();
      }, []); 

  // Searching logic
  const filteredData = data.filter((row:any) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  // Sorting logic
  const sortedData = [...filteredData].sort((a:any, b:any) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  

    //////////status wise sorting
    const filterdata = sortedData.filter((item: any) => {
        // Check if the status is not empty and matches the selected status
        return item?.Status.toLowerCase().includes(selectedStatus.toLowerCase());
      });
      
      console.log(filterdata);


  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const paginatedData = selectedStatus?filterdata:sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Handling sort
  const handleSort = (key:any) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  const handledelete=async(id:number)=>{
          try {
            const web=new Web(testurl);
            await web.lists.getById(teststudentid).items.getById(id).delete().
            then(()=>{
              const remaindata=data.filter(item=>item.id!=id)
              setData(remaindata);
              fetchApidata();
            })
          } catch (error) {
            console.log("data in not delete");
            
          }
       }
  
       const openModal=()=>setIsopenmodal(true);
       const closeModal=()=>setIsopenmodal(false);
  
  
       const handleChange=(e:any)=>{
          const {name,value}=e.target;
          setFormdata(prevdata=>({
            ...prevdata,
            [name]:value,
           
          }))
    
         }
  
       
       const handleedit=(item:any)=>{
          setEditindex(item.Id);
          const selecteditem=item;
          setFormdata({
              Title:selecteditem.Title||"",
              Email:selecteditem.Email||"",
              PhoneNumber:selecteditem.PhoneNumber||"",
              CallSchedule:moment(selecteditem.CallSchedule).format("YYYY-MM-DD hh:mm:ss A")||"",
              Status:selecteditem.Status||"",
              Response:selecteditem.Response||"",
              // Author:selecteditem.Author.Title||""
          })
          setIsopenmodal(true);
         
    
         }
  
         const handlesumbit=async(e:any)=>{
          e.preventDefault();
         
    
          try {
            let web=new Web(testurl);
           if(editindex!==null)
           {
            await web.lists.getById(teststudentid).items.getById(editindex).update({
              CallSchedule:formdata.CallSchedule,
              Status:formdata.Status,
              Response:formdata.Response,
            }).then((res)=>{
                const updatedata=[...data];
                updatedata[editindex]={...updatedata[editindex],...formdata}
                setData(updatedata);
    
              setIsopenmodal(false)
              setEditindex(null);
            setFormdata({
                  Title:"",
              Email:"",
              PhoneNumber:"",
              CallSchedule:"",
              Status:"",
              Response:"",
              // Author:""
            })
            })
            fetchApidata();
    
           }
            
          } catch (error) {
            console.log(error);
            
          }
    
         }




         ///////////////
        


  return (
    <div className="container my-4">
      <h2 className="text-center">TenStack Table</h2>

      {/* Search Bar */}
      
      <div className="mb-3 col-lg-6 ">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
     

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th onClick={() => handleSort('Id')}>#</th>
              <th onClick={() => handleSort('Title')}>Title</th>
              <th onClick={() => handleSort('PhoneNumber')}>PhoneNumber</th>
              <th onClick={() => handleSort('Email')}>Email</th>
              <th onClick={() => handleSort('CallSchedule')}>CallSchedule</th>
              {/* <th onClick={() => handleSort('Status')}>Status</th> */}
               <th style={{padding:"3px"}}>
                            {/* Status <IoIosArrowDropdownCircle /> */}
                            <select
                            style={{height:"33px",width:"160px",fontWeight:"700"}}
                            className="form-select"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        >
                            <option value="" style={{fontSize:"500"}}>Select Status</option>
                            <option value="New">New</option>
                            <option value="Joined">Joined</option>
                            <option value="Connected">Connected</option>
                            <option value="Not-Interested">Not Interested</option>
                            <option value="Follow-Up">Follow-Up</option>
                        </select>
                        </th>
              <th onClick={() => handleSort('Response')}>Response</th>
              <th onClick={() => handleSort('Created')}>Created</th>
              <th colSpan={2}>Action</th>

            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr key={row.id}>
                <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
                <td>{row.Title}</td>
                <td>{row.PhoneNumber}</td>
                <td>{row.Email}</td>
                <td>{row.CallSchedule?moment(row.CallSchedule).format("DD/MM/YYYY hh:mm:ss A"):null}</td>
                <td>{row.Status}</td>
                <td>{row.Response}</td>
                <td>{row.Created?moment(row.Created).format("DD/MM/YYYY hh:mm:ss A"):null}</td>
                <td style={{padding:"0px"}}>
                <button className='btn 'onClick={()=>{handleedit(row);openModal()}} ><FaRegEdit style={{ color: "green" }}/></button>
                <button className='btn ml-2' onClick={()=>handledelete(row.Id)}><MdDelete style={{ color: "red" }}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

       <div>
            {
              isopenmodal&&(
                <Panel  isOpen={isopenmodal} onDismiss={closeModal} type={PanelType.medium}>
                  <div className='form-label'>{editindex==null?<h5 >Form Details</h5> :<h5 >Form Details</h5>}</div>
                  <form onSubmit={handlesumbit}>
                          <div className="row">
                              <div className="col-lg-6">
                                  <div className="form-group m-2">
                                      <label >Title</label>
                                      <input
                                      type="text"
                                      className="form-control mt-2"
                                      name='Title'
                                      value={formdata.Title}
                                      onChange={handleChange}
                                      autoComplete='off'
                                      disabled
                                      />
                                  </div>
                              </div>
                              <div className="col-lg-6">
                                  <div className="form-group m-2">
                              <label >Email</label>
                              <input
                                  type="text"
                                  className="form-control mt-2"
                                  name='Email'
                                  value={formdata.Email}
                                  onChange={handleChange}
                                  autoComplete='off'
                                  disabled
                              />
                              </div>
                              </div>
                              <div className="col-lg-6">
                                  <div className="form-group m-2">
                              <label >Phone Number</label>
                              <input
                                  type="text"
                                  className="form-control mt-2"
                                  name='PhoneNumber'
                                  value={formdata.PhoneNumber}
                                  onChange={handleChange}
                                  autoComplete='off'
                                  disabled
                              
                              />
                              </div>
                              </div>
                              
                              <div className="col-lg-6">
                              <div className="form-group m-2">
                                  <label >Call Schedule</label>
                                  <input
                                      type="date"
                                      className="form-control mt-2"
                                      name='CallSchedule'
                                      value={moment(formdata.CallSchedule).format("YYYY-MM-DD")}
                                      onChange={handleChange}
                                      autoComplete='off'
                                  />
                                  </div>
                              </div>
                          
                              
                             
                              <div className="col-lg-12">
                              <div className="form-group m-2">
                                  <label>Response</label>
                                  <textarea
                                  rows={4}
                                  className="form-control mt-2"
                                  name='Response'
                                  value={formdata.Response}
                                  onChange={handleChange}
                                  autoComplete='off'
                                  
                                  />
                              </div>
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
                                      className='mx-2'
                                      checked={formdata.Status === "New"}
                                      onChange={handleChange}
                                      />
                                      <span>New</span>
                                  </label>
                                  <label>
                                      <input
                                      type="radio"
                                      name="Status"
                                      value="Connected"
                                      className='mx-2'
                                      checked={formdata.Status === "Connected"}
                                      onChange={handleChange}
                                      />
                                      <span>Connected</span>
                                  </label>
                                  <label>
                                      <input
                                      type="radio"
                                      name="Status"
                                      value="Follow-UP"
                                      className='mx-2'
                                      checked={formdata.Status === "Follow-UP"}
                                      onChange={handleChange}
                                      />
                                      <span>Follow-UP</span>
                                  </label>
                                  <label>
                                      <input
                                      type="radio"
                                      name="Status"
                                      value="Not Interested"
                                      className='mx-2'
                                      checked={formdata.Status === "Not Interested"}
                                      onChange={handleChange}
                                      />
                                      <span>Not Interested</span>
                                  </label>
                                  <label>
                                      <input
                                      type="radio"
                                      name="Status"
                                      value="Joined"
                                      className='mx-2'
                                      checked={formdata.Status === "Joined"}
                                      onChange={handleChange}
                                      />
                                      <span>Joined</span>
                                  </label>
                                  
                                  
                                  </div>
                              </div>
                              </div>
                              
                          <div className='text-end'>
                              <button
                              type="button"
                              className="btn btn-danger"
                              onClick={closeModal}
                              >
                              Close
                              </button>
                          {editindex==null? <button type="submit" className="btn btn-primary m-3">
                              Save 
                              </button>: <button type="submit" className="btn btn-primary m-3">
                              Update 
                              </button>}
                          </div>
                          </div>
      
                  </form>   
                </Panel>
              )
                  }
          </div>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TenStackTable;
