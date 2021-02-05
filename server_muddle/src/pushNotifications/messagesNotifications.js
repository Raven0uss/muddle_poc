const getPushNotificationObject = ({
  user,
  comment = "",
  debate = "",
  message = "",
  type,
  language,
  pushToken,
}) => {
  const lang = language === "ENGLISH" ? "en" : "fr";
  const pushNotifications = {
    crowned: {
      fr: {
        sound: true,
        title: "Vous obtenu la couronne !",
        body:
          "L'équipe Muddles vient de vous délivrer une couronne. Vous avez 24H pour créer un débat. Celui sera en top débat sur le fil d'actualité de chaque utilisateur.",
      },
      en: {
        sound: true,

        title: "You got the crown !",
        body:
          "Muddles team gave you a crown. You have 24H to create a debate. This debate will be placed in the top of the feeds for all users.",
      },
    },
    invitationDuo: {
      fr: {
        sound: true,
        title: "Invitation à un débat",
        body: `${user} vous invite pour un débat duo.`,
      },
      en: {
        sound: true,
        title: "Debate invitation",
        body: `${user} invite you to a duo debate.`,
      },
    },
    wonDebateDuo: {
      fr: {
        sound: true,
        title: "Vous remporté un débat en duo !",
        body:
          "Vous avez remporté un duo. Les points de trophées ont été ajouté à votre profil.",
      },
      en: {
        sound: true,
        title: "You won a duo debate !",
        body:
          "You won a duo debate. Trophee points have been added to your profile.",
      },
    },
    wonDebateComment: {
      fr: {
        sound: true,
        title: "Vous avez été élu top commentaire !",
        body:
          "Vous avez obtenu le plus de mentions j'aime sur un débat. Les points de trophées ont été ajouté à votre profil.",
      },
      en: {
        sound: true,
        title: "You were elected as top comment !",
        body:
          "You got the most likes on a debate. Trophee points have been added to your profile.",
      },
    },
    closeDebate: {
      fr: {
        sound: true,
        title: `${user} vous demande de clôturer le débat.`,
        body: `${debate.slice(0, 100)}${debate.length > 99 ? "..." : ""}`,
      },
      en: {
        sound: true,

        title: `${user} ask you to close the debate.`,
        body: `${debate.slice(0, 100)}${debate.length > 99 ? "..." : ""}`,
      },
    },
    deleteDebate: {
      fr: {
        sound: true,

        title: `${user} vous demande de supprimer le débat.`,
        body: `${debate.slice(0, 100)}${debate.length > 99 ? "..." : ""}`,
      },
      en: {
        sound: true,
        title: `${user} ask you to delete the debate.`,
        body: `${debate.slice(0, 100)}${debate.length > 99 ? "..." : ""}`,
      },
    },
    like: {
      fr: {
        title: `${user} a aimé votre commentaire.`,
        body: `${comment.slice(0, 100)}${comment.length > 99 ? "..." : ""}`,
      },
      en: {
        title: `${user} liked your comment.`,
        body: `${comment.slice(0, 100)}${comment.length > 99 ? "..." : ""}`,
      },
    },
    dislike: {
      fr: {
        title: `${user} n'a pas aimé votre commentaire`,
        body: `${comment.slice(0, 100)}${comment.length > 99 ? "..." : ""}`,
      },
      en: {
        title: `${user} disliked your comment.`,
        body: `${comment.slice(0, 100)}${comment.length > 99 ? "..." : ""}`,
      },
    },
    vote: {
      fr: {
        title: `${user} a voté sur votre débat.`,
        body: `${debate.slice(0, 100)}${debate.length > 99 ? "..." : ""}`,
      },
      en: {
        title: `${user} voted on your debate.`,
        body: `${debate.slice(0, 100)}${debate.length > 99 ? "..." : ""}`,
      },
    },
    comment: {
      fr: {
        title: `${user} a commenté votre débat.`,
        body: `${debate.slice(0, 100)}${debate.length > 99 ? "..." : ""}`,
      },
      en: {
        title: `${user} commented your debate.`,
        body: `${debate.slice(0, 100)}${debate.length > 99 ? "..." : ""}`,
      },
    },
    subcomment: {
      fr: {
        title: `${user} a répondu à votre commentaire.`,
        body: `${comment.slice(0, 100)}${comment.length > 99 ? "..." : ""}`,
      },
      en: {
        title: `${user} answered to your comment.`,
        body: `${comment.slice(0, 100)}${comment.length > 99 ? "..." : ""}`,
      },
    },
    message: {
      fr: {
        sound: true,
        title: `${user}`,
        body: `${message.slice(0, 100)}${message.length > 99 ? "..." : ""}`,
      },
      en: {
        sound: true,
        title: `${user}`,
        body: `${message.slice(0, 100)}${message.length > 99 ? "..." : ""}`,
      },
    },
  };

  return { ...pushNotifications[type][lang], pushToken };
};

export default getPushNotificationObject;
