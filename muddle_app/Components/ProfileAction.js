import React from "react";
import Select from "./Select";
import CustomIcon from "./Icon";
import themeSchema from "../CustomProperties/Theme";
import i18n from "../i18n";
import UserContext from "../CustomProperties/UserContext";
import { get, isEmpty, isNil } from "lodash";
import { gql, useMutation } from "@apollo/client";
import { pickImageAndGetUrl } from "../Library/pickImage";
import { storeItem } from "../CustomProperties/storage";
import { isBlocked } from "../Library/isBlock";

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

const FOLLOW = gql`
  mutation($userId: ID!, $currentUserId: ID!) {
    updateUser(
      where: { id: $currentUserId }
      data: { following: { connect: { id: $userId } } }
    ) {
      id
    }
  }
`;

const UNFOLLOW = gql`
  mutation($userId: ID!, $currentUserId: ID!) {
    updateUser(
      where: { id: $currentUserId }
      data: { following: { disconnect: { id: $userId } } }
    ) {
      id
    }
  }
`;

const CREATE_NEW_CONVERSATION = gql`
  mutation($from: ID!, $to: ID!) {
    createConversation(
      data: { speakers: { connect: [{ id: $from }, { id: $to }] } }
    ) {
      id
      speakers {
        id
        firstname
        lastname
        profilePicture
        email
        certified
      }
      messages {
        id
        content
        from {
          id
          firstname
          lastname
          email
          certified
          profilePicture
        }
        to {
          id
          firstname
          lastname
          email
          certified
          profilePicture
        }
      }
    }
  }
`;

const UPDATE_PROFILE_PICTURE = gql`
  mutation($profilePicture: String!, $userId: ID!) {
    updateUser(
      where: { id: $userId }
      data: { profilePicture: $profilePicture }
    ) {
      id
      email
      firstname
      certified
      lastname
      language
      profilePicture
      coverPicture
      blocked {
        id
      }
      blocking {
        id
      }
    }
  }
`;

const UPDATE_COVER_PICTURE = gql`
  mutation($coverPicture: String!, $userId: ID!) {
    updateUser(where: { id: $userId }, data: { coverPicture: $coverPicture }) {
      id
      email
      firstname
      lastname
      language
      profilePicture
      coverPicture
      certified
      blocked {
        id
      }
      blocking {
        id
      }
    }
  }
`;

const BLOCK_USER = gql`
  mutation($userId: ID!, $currentUserId: ID!) {
    updateUser(
      where: { id: $currentUserId }
      data: { blocked: { connect: { id: $userId } } }
    ) {
      id
    }
  }
`;

const UNBLOCK_USER = gql`
  mutation($userId: ID!, $currentUserId: ID!) {
    updateUser(
      where: { id: $currentUserId }
      data: { blocked: { disconnect: { id: $userId } } }
    ) {
      id
    }
  }
`;

const ProfileAction = (props) => {
  const { currentUser, setCurrentUser } = React.useContext(UserContext);
  const { navigation, me, theme, user, setLoadingPicture } = props;

  const [following, setFollowing] = React.useState(
    me ? false : isFollowing(user, currentUser)
  );
  const [privateAccount, setPrivateAccount] = React.useState(isPrivate(user));

  const [setPrivate] = useMutation(SET_PRIVATE);
  const [reqFollow] = useMutation(FOLLOW);
  const [reqUnfollow] = useMutation(UNFOLLOW);

  const [updateProfilePicture] = useMutation(UPDATE_PROFILE_PICTURE, {
    onCompleted: async (response) => {
      const { updateUser: queryResponse } = response;
      setCurrentUser(queryResponse);
      await storeItem("user", JSON.stringify(queryResponse));
      setLoadingPicture(false);
    },
  });

  const [blockUser] = useMutation(BLOCK_USER, {
    // onCompleted: () => {
    //   navigation.reset({
    //     index: 0,
    //     routes: [{ name: "Home" }],
    //   });
    // },
  });
  const [unblockUser] = useMutation(UNBLOCK_USER);

  const [updateCoverPicture] = useMutation(UPDATE_COVER_PICTURE, {
    onCompleted: async (response) => {
      const { updateUser: queryResponse } = response;
      setCurrentUser(queryResponse);
      await storeItem("user", JSON.stringify(queryResponse));
      setLoadingPicture(false);
    },
  });

  const [createNewConversation, { loading: loadingMutation }] = useMutation(
    CREATE_NEW_CONVERSATION,
    {
      onCompleted: (response) => {
        const { createConversation: queryResponse } = response;

        navigation.replace("Chat", {
          conversation: queryResponse,
        });
      },
    }
  );

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
        onSelect={async (action) => {
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
          if (action.value === "PROFILE_PICTURE") {
            setLoadingPicture(true);
            const imageUrl = await pickImageAndGetUrl();
            if (imageUrl !== null)
              updateProfilePicture({
                variables: {
                  userId: currentUser.id,
                  profilePicture: imageUrl,
                },
              });
            else {
              setLoadingPicture(false);
            }
          }
          if (action.value === "COVER_PICTURE") {
            setLoadingPicture(true);
            const imageUrl = await pickImageAndGetUrl();
            if (imageUrl !== null)
              updateCoverPicture({
                variables: {
                  userId: currentUser.id,
                  coverPicture: imageUrl,
                },
              });
            else {
              setLoadingPicture(false);
            }
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
      list={
        isBlocked({ currentUser, userId: user.id })
          ? [
              {
                label: i18n._("actionUnblock"),
                value: "UNBLOCK",
              },
            ]
          : [
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
            ]
      }
      selected={null}
      placeholder=""
      onSelect={(action) => {
        if (action.value === "FOLLOW") {
          setFollowing(true);
          reqFollow({
            variables: {
              userId: user.id,
              currentUserId: currentUser.id,
            },
          });
        }
        if (action.value === "UNFOLLOW") {
          setFollowing(false);
          reqUnfollow({
            variables: {
              userId: user.id,
              currentUserId: currentUser.id,
            },
          });
        }
        if (action.value === "CONTACT") {
          const conversations = user.conversations;
          console.log(conversations);
          if (isNil(conversations) || isEmpty(conversations)) {
            createNewConversation({
              variables: {
                from: currentUser.id,
                to: user.id,
              },
            });
          } else {
            navigation.push("Chat", {
              conversation: conversations[0],
            });
          }
        }
        if (action.value === "BLOCK") {
          setCurrentUser((c) => ({
            ...c,
            blocked: [...c.blocked, { id: user.id }],
          }));
          blockUser({
            variables: {
              userId: user.id,
              currentUserId: currentUser.id,
            },
          });
        }
        if (action.value === "UNBLOCK") {
          setCurrentUser((c) => {
            const blockIndex = c.blocked.findIndex((u) => u.id === user.id);
            const blockedCopy = JSON.parse(JSON.stringify(c.blocked));
            blockedCopy.splice(blockIndex, 1);
            return {
              ...c,
              blocked: blockedCopy,
            };
          });
          unblockUser({
            variables: {
              userId: user.id,
              currentUserId: currentUser.id,
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
};

export default ProfileAction;
