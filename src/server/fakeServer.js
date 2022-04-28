import { ResponseServer } from "@/factory/response";
import { User } from "@/factory/user";
import { uuid } from "@/utils";

class FakeServer {
  _users = [];
  _limit = 5;
  _offset = 1;

  addUser = (user) => {
    if (this.userExisting(user.email)) {
      return new ResponseServer({
        error: `${user.email} existing!`,
        data: null,
        message: "Bad request",
        status: 400,
      });
    }
    const newUser = new User({
      id: uuid(),
      name: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      active: user.active,
    });
    this._users.unshift(newUser);

    return newUser;
  };

  userExisting = (email) => {
    return this._users.find((u) => u.email === email);
  };

  updateUser = (userUpdate) => {
    const { email, ...rest } = userUpdate;

    const updated = this._users.map((user) => {
      if (user.id === userUpdate.id) {
        return {
          ...user,
          ...rest,
        };
      }
      return user;
    });

    this._users = updated;

    return userUpdate;
  };

  deleteUser = (id) => {
    this._users = this._users.filter((user) => user.id !== id);

    return new ResponseServer({
      status: 200,
      message: "delete success",
      data: null,
      error: `${id} delete success`,
    });
  };

  paging = (originArray = [], limit, offset) => {
    return originArray.slice(offset * limit - limit, offset * limit);
  };

  queryUser = (limit, offset) => {
    return this.paging(
      this._users,
      limit || this._limit,
      offset || this._offset
    );
  };

  countUser = () => {
    return this._users.length;
  };
}

export default new FakeServer();
