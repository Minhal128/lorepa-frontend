import { IoChatbox, IoSettingsOutline, IoHelpCircleOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { BsBuildings } from "react-icons/bs";
import { IoCalendarOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { FaRegBell, FaRegCalendarAlt } from "react-icons/fa";
import { HiOutlineCreditCard, HiOutlineDocumentText, HiOutlineClipboardDocumentList } from "react-icons/hi2";

export const userNav = [
    { id: 1, link: "home", key: "dashboard", icon: <GoHome /> },
    { id: 2, link: "reservation", key: "reservation", icon: <FaRegCalendarAlt /> },
    { id: 3, link: "payment", key: "payment", icon: <HiOutlineCreditCard /> },
    { id: 4, link: "document", key: "document", icon: <HiOutlineDocumentText /> },
    { id: 5, link: "messaging", key: "messaging", icon: <IoChatbox /> },
    { id: 6, link: "notification", key: "notifications", icon: <FaRegBell /> },
    { id: 7, link: "support", key: "support", icon: <IoHelpCircleOutline /> },
    { id: 8, link: "profile", key: "profile", icon: <FiUser /> },
];

export const buyerNav = [
    { id: 1, link: "home", key: "dashboard", icon: <GoHome /> },
    { id: 2, link: "listing", key: "listing", icon: <HiOutlineClipboardDocumentList /> },
    { id: 3, link: "reservation", key: "reservation", icon: <FaRegCalendarAlt /> },
    { id: 4, link: "earnings", key: "earnings", icon: <HiOutlineCreditCard /> },
    { id: 5, link: "documents", key: "documents", icon: <HiOutlineDocumentText /> },
    { id: 6, link: "messaging", key: "messaging", icon: <IoChatbox /> },
    { id: 7, link: "notification", key: "notifications", icon: <FaRegBell /> },
    { id: 8, link: "support", key: "support", icon: <IoHelpCircleOutline /> },
    { id: 9, link: "profile", key: "profile", icon: <FiUser /> },
];


export const adminNav = [
    { id: 1, link: "home", key: "dashboard", icon: <GoHome /> },
    { id: 2, link: "listing", key: "listing", icon: <BsBuildings /> },
    { id: 3, link: "booking", key: "booking", icon: <IoCalendarOutline /> },
    { id: 4, link: "user", key: "user", icon: <FiUser /> },
    { id: 5, link: "settings", key: "settings", icon: <IoSettingsOutline /> },
    { id: 6, link: "support", key: "support", icon: <IoHelpCircleOutline /> },
];
