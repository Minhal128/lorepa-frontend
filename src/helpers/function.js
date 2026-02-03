import toast from "react-hot-toast";

export const handleLogout = (router) => {

    let loader = toast.loading("Logging out...");
    localStorage.removeItem('token');
    localStorage.removeItem('accountId');
    localStorage.removeItem('roleId');
    toast.dismiss(loader)
    router('/');
};


export const formatReadableDate =(isoDate)=>{
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    return `${day} ${month} ${weekday}`;
}