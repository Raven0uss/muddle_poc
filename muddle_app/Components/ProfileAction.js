import React from "react";
import Select from "./Select";
import CustomIcon from "./Icon";
import themeSchema from "../CustomProperties/Theme";
import i18n from "../i18n";
import UserContext from "../CustomProperties/UserContext";
import { get } from "lodash";
import { gql, useMutation } from "@apollo/client";

const isFollowing = (user, currentUser) => {
  const index = user.followers.findIndex((u) => u.id === currentUser.id);
  return index !== -1;
};
const isPrivate = (user) => {
  return get(user, "private", false);
};

const SET_PRIVATE = gql`
  mutation($userId: ID!, $private: Boolean!) {
    updateUser(where: { id: $userId }, data: { private: $private }) {
      id
    }
  }
`;

const ProfileAction = (props) => {
  const { currentUser } = React.useContext(UserContext);
  const { navigation, me, theme, user } = props;

  const [following, setFollowing] = React.useState(
    me ? false : isFollowing(user, currentUser)
  );
  const [privateAccount, setPrivateAccount] = React.useState(isPrivate(user));

  const [setPrivate] = useMutation(SET_PRIVATE);

  if (me)
    return (
      <Select
        list={[
          {
            label: i18n._("modifyProfilePicture"),
            value: "PROFILE_PICTURE",
          },
          {
            label: i18n._("modifyCoverPicture"),
            value: "COVER_PICTURE",
          },
          privateAccount
            ? {
                label: i18n._("publicMode"),
                value: "PUBLIC",
              }
            : {
                label: i18n._("privateMode"),
                value: "PRIVATE",
              },
        ]}
        selected={null}
        placeholder=""
        onSelect={(action) => {
          if (action.value === "PUBLIC") {
            setPrivateAccount(false);
            setPrivate({
              variables: {
                userId: currentUser.id,
                private: false,
              },
            });
          }
          if (action.value === "PRIVATE") {
            setPrivateAccount(true);
            setPrivate({
              variables: {
                userId: currentUser.id,
                private: true,
              },
            });
          }
        }}
        renderComponent={
          <CustomIcon
            name="more-vert"
            size={22}
            color={themeSchema[theme].colorText}
          />
        }
      />
    );
  return (
    <Select
      list={[
        following
          ? {
              label: i18n._("actionUnfollow"),
              value: "UNFOLLOW",
            }
          : {
              label: i18n._("actionFollow"),
              value: "FOLLOW",
            },
        {
          label: i18n._("actionContact"),
          value: "CONTACT",
        },
        {
          label: i18n._("actionBlock"),
          value: "BLOCK",
        },
      ]}
      selected={null}
      placeholder=""
      onSelect={(action) => {
        if (action.value === "FOLLOW") {
          setFollowing(true);
        }
        if (action.value === "UNFOLLOW") {
          setFollowing(false);
        }
        if (action.value === "CONTACT") {
          // Ouvrir le chat ici
        }
        if (action.value === "BLOCK") {
        }
      }}
      renderComponent={
        <CustomIcon
          name="more-vert"
          size={22}
          color={themeSchema[theme].colorText}
        />
      }
    />
  );
};

export default ProfileAction;
