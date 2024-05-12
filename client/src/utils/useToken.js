export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    const userToken = JSON.parse(tokenString);

    return userToken;
  };

  const saveToken = (userToken) => {
    localStorage.setItem("token", JSON.stringify(userToken));
  };

  return {
    setToken: saveToken,
    token: getToken(),
  };
}
