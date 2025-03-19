const getAdminData = async (token, data) => {
  const config = {
    headers: {
      "x-auth-token": `${token}`,
    },
  };
  const response = await axios.post(
    `${BASE_URL}scheduleClass/courseList`,
    {
      itemPerPage: data.itemPerPage,
      page: data.page,
      name: data.name,
    },
    config
  );
  return { data: response.data.data, totalPages: response.data.totalPages };
};

const AdminService = {
  getAdminData,
};

export default AdminService;
