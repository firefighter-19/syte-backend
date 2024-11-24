import { FC, useEffect } from "react";
import { useCreateUserMutation } from "../../shared/api/user/user";
import { Button } from "antd";
import { useNavigate, useSearchParams } from "react-router";

export const Home: FC = () => {
  const [createUser, { data, error }] = useCreateUserMutation();

  const [, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    setSearchParams(data?.id ? { user_id: data.id } : {});
    if (data && data.id) {
      navigate(`/catalog?user_id=${data.id}`);
    }
  }, [data]);

  return (
    <>
      {!data ? (
        <Button type="primary" onClick={() => createUser({ user: "JohnDoe" })}>
          Create user
        </Button>
      ) : null}
      <div>{error ? "Sorry, something went wrong" : null}</div>
    </>
  );
};
