import FakeServer from "./fakeServer";

export function useServer() {
  return {
    addUser: FakeServer.addUser,
    getUsers: FakeServer.queryUser,
    updateUser: FakeServer.updateUser,
    deleteUser: FakeServer.deleteUser,
    countUser: FakeServer.countUser,
  };
}
