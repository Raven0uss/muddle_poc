import React from "react";
import Select from "./Select";
import CustomIcon from "./Icon";
import themeSchema from "../CustomProperties/Theme";

// const isFollow = () => {};
// const is = () => {};

const ProfileAction = (props) => {
  const { navigation, me, theme, user } = props;

  console.log(user);
  if (me)
    return (
      <Select
        list={[
          {
            label: "Modifier la photo de profil",
            value: "PROFILE_PICTURE",
          },
          {
            label: "Modifier la couverture",
            value: "COVER_PICTURE",
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
        {
          label: "ajouter",
          value: "REPORT",
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
