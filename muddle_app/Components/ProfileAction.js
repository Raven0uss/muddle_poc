import React from "react";
import Select from "./Select";
import CustomIcon from "./Icon";
import themeSchema from "../CustomProperties/Theme";
import i18n from "../i18n";
import UserContext from "../CustomProperties/UserContext";
import { get } from "lodash";

const isFollowing = (user, currentUser) => {
  const index = user.followers.findIndex((u) => u.id === currentUser.id);
  return index !== -1;
};
const isPrivate = (user) => {
  return get(user, "private", false);
};

const ProfileAction = (props) => {
  const { currentUser } = React.useContext(UserContext);
  const { navigation, me, theme, user } = props;

  const following = me ? false : isFollowing(user, currentUser);
  const privateAccount = isPrivate(user);

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
        onSelect={(action) => {}}
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
      onSelect={(action) => {}}
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
