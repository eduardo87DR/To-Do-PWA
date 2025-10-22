export const showNotification = (message) => {
  if (!("Notification" in window)) {
    console.log("El navegador no soporta notificaciones");
    return;
  }

  console.log("Estado permiso:", Notification.permission);

  if (Notification.permission === "granted") {
    console.log("Mostrando notificación...");
    new Notification("Lista de Tareas", {
      body: message,
      icon: "/logo.png",
    });
  } else if (Notification.permission !== "denied") {
    console.log("Solicitando permiso...");
    Notification.requestPermission().then((permission) => {
      console.log("Nuevo estado:", permission);
      if (permission === "granted") {
        new Notification("Lista de Tareas", {
          body: message,
          icon: "/logo.png",
        });
      }
    });
  }
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) return false;

  if (Notification.permission === "granted") return true;

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};
