import * as React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Web} from "sp-pnp-js";
import "./Style.css";
import * as moment from 'moment';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Panel, PanelType} from '@fluentui/react/lib/Panel';
//import { IoIosArrowDropdownCircle } from "react-icons/io";


const StudentReferral = () => {

    const testurl="https://smalsusinfolabs.sharepoint.com/sites/IITIQ";
    const teststudentid="74B7FEF6-020F-4F64-8DE4-338FBAEF2687";



    const [data,setData]=React.useState<any[]>([]);
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
    const [selectedStatus, setSelectedStatus] = React.useState('New');

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

    console.log("total data",data);

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
  
            /////////////////sorting 
            const sortedata=[...data].sort((a, b) => new Date(b.Created).getTime() - new Date(a.Created).getTime())
            
            const filterdata = sortedata.filter((item: any) => {
                // Check if the status is not empty and matches the selected status
                return item?.Status.toLowerCase().includes(selectedStatus.toLowerCase());
              });
              
              console.log(filterdata);
              
      
     

  return (
    <>
        <div className='container-fluid bg pb-3'>
            <h1 className='text-center text-light pt-3' >Referral Page</h1>
           <div style={{margin:"20px"}}>
           <table className="table  text-center mt-3 " style={{backgroundColor:"white"}}  >
                    <thead className=' fw-bolder p-1'>
                      <tr>
                        <th>Title</th>
                        <th>Phone No</th>   
                        <th>Email</th>
                        <th>Call Appointment</th>
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
                        <th>Response</th>
                        <th>Created</th>
                      
                         <th colSpan={2}>Action</th>
                      </tr>
                    </thead>
                    
                        <tbody >
                                        {
                                            filterdata.map((item:any,idx:any)=>{
                                                return(
                                                    <tr key={idx}>
                                                        <td>{item?.Title}</td>
                                                        <td>{item?.PhoneNumber}</td>
                                                        <td>{item?.Email}</td>                                  
                                                        <td>{item?.CallSchedule?moment(item.CallSchedule).format("DD/MM/YYYY hh:mm:ss A"):null}</td>
                                                        <td>{item?.Status}</td>
                                                        <td>{item?.Response}</td>
                                                        <td>{item?.Created?moment(item.Created).format("DD/MM/YYYY "):null}</td>
                                                    
                                                        <td style={{padding:"0px"}}>
                                                            <button className='btn 'onClick={()=>{handleedit(item);openModal()}} ><FaRegEdit style={{ color: "green" }}/></button>
                                                            <button className='btn ml-2' onClick={()=>handledelete(item.Id)}><MdDelete style={{ color: "red" }}/></button>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
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
    

</div>

        
    </>
  )
}

export default StudentReferral