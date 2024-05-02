import { Modal, Input, Table } from "antd"
import { useState, useEffect } from "react"
import axios from "axios"
import { apiConfig } from "../../config/api.config"
import Icon from "@mdi/react"
import { mdiSquareEditOutline, mdiDeleteOutline } from "@mdi/js"
import { toast} from "react-toastify"
import Toastifycon from "../../../global-components/Toastcon";
import "react-toastify/dist/ReactToastify.css"
import { useFormik } from "formik"
import * as Yup from "yup"
import dayjs from "dayjs";

function EditSubject() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalEditOpen, setIsModalEditOpen] = useState(false)
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false)
  const [subjectList, setSubjectList] = useState([])
  const [subjectToDelete, setSubjectToDelete] = useState("")
  const [data, setData] = useState(null)
  const [isEdit,setIsEdit] = useState(false)

  const showModalAdd = () => {
    setIsModalOpen(true)
    setIsEdit(false)
    setData(null)
  }

  const handleOkAdd = () => {
    setIsModalOpen(false)
  }

  const handleCancelAdd = () => {
    setIsModalOpen(false)
  }

  const showModalEdit = () => {
    setIsModalEditOpen(true)
  }

  const handleCancelEdit = () => {
    setIsModalEditOpen(false)
  }

  const showModalDelete = async (id) => {
    try {
      const response = await axios.get(`${apiConfig.baseURL}/subject/${id}`)
      setData(response.data.data)
      setSubjectToDelete(response.data.data.name)
      setIsModalDeleteOpen(true)
    } catch (error) {
      console.log("เกิดข้อผิดพลาดในการดึงข้อมูลรายวิชา", error)
    }
  }

  const handleCancelDelete = () => {
    setIsModalDeleteOpen(false)
  }



  const getSubject = () => {
    axios
      .get(`${apiConfig.baseURL}/subject`)
      .then((res) => {
        setSubjectList(res.data.data)
        
      })
      .catch((err) => {
        console.log("เกิดข้อผิดพลาดในการแสดงผลรายวิชา", err)
      })
  }

  const getSubjectSingle = (id) => {
    axios
      .get(`${apiConfig.baseURL}/subject/${id}`)
      .then((res) => {
        setData(res.data.data)
      })
      .catch((err) => {
        console.log("เกิดข้อผิดพลาดในการแสดงผลรายวิชา", err)
      })
  }

  const updateSubject = (values) => {
    axios
      .patch(`${apiConfig.baseURL}/editnamesubject`, {
        id: data?.id,
        name: values.subject,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("อัปเดตรายวิชาสำเร็จ");
          setIsModalEditOpen(false);
          getSubject();
        } else {
          console.log("เกิดข้อผิดพลาดในการแก้ไขรายวิชา");
        }
      })
      .catch((error) => {
        console.log("Err", error);
      });
  };
  

  const editSubject = (id) => {
    getSubjectSingle(id)
    setIsEdit(true)
    showModalEdit()
  }


  const handleDelete = () => {
    axios
      .patch(`${apiConfig.baseURL}/deletesubject`, {
        id: data?.id,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("ลบรายวิชาสำเร็จ")
          setIsModalDeleteOpen(false)
          getSubject()
        } else {
          console.log("เกิดข้อผิดพลาดในการลบรายวิชา")
        }
      })
      .catch((error) => {
        console.log("Err", error)
      })
  }

  const initialValues = {
    subject: data?.name || "",
  }
  const schema = Yup.object({
    subject: Yup.string().required("กรุณากรอกรายวิชา"),
  })

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    onSubmit: (values) => {
      const { subject } = values;
      if (isEdit) {
        updateSubject(values);
      } else {
        addSubject(subject);
      }
    },
  });
  

  const addSubject = (subject) => {
    axios
      .post(`${apiConfig.baseURL}/add-subject`, {
        name: subject,
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success("สร้างรายวิชาสำเร็จ");
          setIsModalOpen(false);
          getSubject();
        } else {
          console.log("เกิดข้อผิดพลาดในการสร้างรายวิชา");
        }
      })
      .catch((error) => {
        console.log("Err", error);
      });
    formik.resetForm();
  };
  
  useEffect(() => {
    getSubject()
  }, [])

  const columns = [
    {
      title: "รหัสวิชา",
      dataIndex: "id",
      key: "id",
      width: 100,
    },
    {
      title: "ชื่อวิชา",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "วันที่สร้าง",
      dataIndex: "created_at",
      key: "created_at",
      render: (createdAt) => (
        createdAt ? dayjs(createdAt).add(543,'year').format('DD-MM-YYYY HH:mm:ss') : '' // Check if the date is available
      ),
    },
    {
      title: "วันที่แก้ไข",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (updatedAt) => (
        updatedAt ? dayjs(updatedAt).add(543,'year').format('DD-MM-YYYY HH:mm:ss') : '' // Check if the date is available
      ),
    },
    {
      title: "แก้ไข",
      key: "edit",
      width: 300,
      render: (_, record) => (
        <div className="space-x-4 flex">
          <Icon path={mdiSquareEditOutline} size={1} onClick={() => editSubject(record.id)} className="cursor-pointer"/>
          <Icon path={mdiDeleteOutline} size={1} onClick={() => showModalDelete(record.id)} className="text-red-500 cursor-pointer" />
        </div>
      ),
    },
  ];

  return (
    <>
      <Toastifycon />
      <Modal
        title={<div className="text-3xl font-bold">เพิ่มรายวิชา</div>}
        open={isModalOpen}
        onOk={handleOkAdd}
        onCancel={handleCancelAdd}
        footer={null}
        width={500}
      >
        <form className="mt-8" onSubmit={formik.handleSubmit}>
          <label className="text-xl">ชื่อรายวิชาที่ต้องการจะเพิ่ม</label>
          <Input
            placeholder="กรุณากรอกชื่อรายวิชาที่ต้องการจะเพิ่ม"
            className="my-1"
            id="subject"
            value={formik.values.subject}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.subject && formik.errors.subject ? (
            <small className="text-red-500">{formik.errors.subject}</small>
          ) : null}

          <div className="space-x-4  flex items-end justify-end mt-3">
            <button
              type="submit"
              className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
            >
              เพิ่มรายวิชา
            </button>
            <button type="button" className="bg-red-500 w-24 h-8 text-white rounded-md" onClick={handleCancelAdd}>
              ยกเลิก
            </button>
          </div>
        </form>
      </Modal>

      {/* Manage Subject Table */}
      <h1 className="text-lg">จัดการข้อมูลรายวิชา</h1>
      <div>
        <button
          type="button"
          onClick={showModalAdd}
          className="bg-blue-500 text-white p-2 rounded-md mt-4 hover:bg-main-green hover:text-black mb-4"
        >
          เพิ่มข้อมูลรายวิชา
        </button>
      </div>

      <Table dataSource={subjectList} columns={columns} />

      {/* Edit Subject Modal */}
      <Modal
        title={<div className="text-2xl ">แก้ไขรายวิชา</div>}
        open={isModalEditOpen}
        onCancel={handleCancelEdit}
        footer={null}
      >
        <form action="" onSubmit={formik.handleSubmit}>
        <label htmlFor="">ชื่อรายวิชา</label>
        <Input
          placeholder="กรุณากรอกชื่อรายวิชาที่ต้องการจะแก้ไข"
          className="my-1"
          id="subject"
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.subject && formik.errors.subject ? (
            <small className="text-red-500">{formik.errors.subject}</small>
          ) : null}
        <div className="space-x-4  flex items-end justify-end mt-3">
          <button
            type="submit"
            className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
          >
            บันทึก
          </button>
          <button type="button" className="bg-red-500 w-24 h-8 text-white rounded-md" onClick={handleCancelEdit}>
            ยกเลิก
          </button>
        </div>
        </form>
      </Modal>

      {/* Delete Subject Modal */}
      <Modal
        title={<div className="text-2xl font-bold">รายการที่จะลบ</div>}
        open={isModalDeleteOpen}
        onCancel={handleCancelDelete}
        footer={null}
      >
        <p className="text-md">
          ต้องการที่จะลบวิชา <span className="text-red-500">{subjectToDelete}</span> ใช่หรือไหม ?
        </p>
        <div className="space-x-4  flex items-end justify-end mt-3">
          <button
            type="button"
            className="bg-blue-500 w-24 h-8 text-white rounded-md hover:bg-main-green transition delay-[30ms]"
            onClick={handleDelete}
          >
            ตกลง
          </button>
          <button type="button" className="bg-red-500 w-24 h-8 text-white rounded-md" onClick={handleCancelDelete}>
            ยกเลิก
          </button>
        </div>
      </Modal>
    </>
  )
}

export default EditSubject