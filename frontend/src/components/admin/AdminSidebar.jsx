import Sidebar from '../layout/Sidebar';

const AdminSidebar = ({ children }) => {
  return <Sidebar portalName="Admin Portal" portalSubtitle="Operations Command">{children}</Sidebar>;
};

export default AdminSidebar;
