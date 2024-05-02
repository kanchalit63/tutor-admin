import { Menu } from "antd";
import { useState } from "react";
import Cookies from 'js-cookie';
import EditSubject from "../edit/EditSubject";
import EditTutor from "../edit/EditTutor";
import EditContact from "../edit/EditContact";
import EditUser from "../edit/EditUser";
import EditPayment from "../edit/EditPayment";
import EditTutorPayment from "../edit/EditTutorPayment";
import Icon from '@mdi/react';
import { mdiAccountCircle } from '@mdi/js';
import { useNavigate } from "react-router-dom";


const items = [
    {
        key: "1",
        label: "จัดการรายวิชา",
        children: <EditSubject />,
    },
    {
        key: "2",
        label: "จัดการติวเตอร์",
        children: <EditTutor />,
    },
    // {
    //     key: "3",
    //     label: "จัดการข้อมูลสมาชิก",
    //     children: <EditUser />,
    // },
    {
        key: "4",
        label: "ข้อมูลติดต่อฉัน",
        children: <EditContact />,
    },
    {
        key: "5",
        label: "ข้อมูลการชำระเงิน",
        children: <EditPayment />,
    },
    {
        key: "6",
        label: "จัดการเงินติวเตอร์",
        children: <EditTutorPayment />,
    },
];



function HomeAdmin() {
    const [selectedKey, setSelectedKey] = useState("1");
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate();
    const menuClickHandler = ({ key }) => {
        setSelectedKey(key);
    };

    const handleLogout = () => {
        Cookies.remove('tutor-token'); // ลบ Token ออกจาก cookies
        navigate('/login'); // นำทางไปยังหน้า /login โดยใช้ useNavigate
    }
    <a>ออกจากระบบ</a>


    return (
        <div>
            <div className="flex h-screen">
                <div className="w-48 bg-[#001529] pt-4 ">
                    <p className="text-white text-center">ADMIN</p>
                    <Menu mode="vertical" theme="dark" selectedKeys={[selectedKey]} onClick={menuClickHandler}>
                        {items.map((item) => (
                            <Menu.Item key={item.key}>{item.label}</Menu.Item>
                        ))}
                    </Menu>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center p-2 text-white mb-4 bg-gray-400 px-4">
                        <div className="text-xl ">
                            จัดการข้อมูลหลังบ้าน
                        </div>
                        <div className="flex items-center space-x-1 ">
                            <span>ADMIN</span> <Icon path={mdiAccountCircle} size={2} onClick={() => setIsOpen(!isOpen)} />
                            {isOpen && (
                                <ul className="dropdown-menu  absolute top-[55px] right-10 text-er-700 pt-1">
                                    <li className="rounded bg-main-green py-2 px-4 cursor-pointer hover:bg-blue-400 hover:text-white"  onClick={handleLogout}>
                                        <a>ออกจากระบบ</a>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                    <div className="px-6">
                        {items.map((item) => (item.key === selectedKey ? <div key={`${item.key}-`}>{item.children}</div> : null))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomeAdmin;
