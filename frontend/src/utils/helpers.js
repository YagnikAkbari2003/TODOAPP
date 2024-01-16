export const generateUID = (title, description) => {
  const titleAbbreviation = title.slice(0, 2).toUpperCase();
  const descriptionAbbreviation = description.slice(0, 3).toUpperCase();

  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, "0");
  const hours = currentDate.getHours().toString().padStart(2, "0");
  const minutes = currentDate.getMinutes().toString().padStart(2, "0");
  const seconds = currentDate.getSeconds().toString().padStart(2, "0");

  const uniqueID = `${titleAbbreviation}${descriptionAbbreviation}_${day}_${hours}${minutes}${seconds}`;

  return uniqueID;
};

export const dateConverter = (inputDate) => {
  inputDate.setUTCHours(
    inputDate.getUTCHours(),
    inputDate.getUTCMinutes(),
    inputDate.getUTCSeconds()
  );

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  };

  const formattedDate = inputDate.toLocaleString("en-IN", options);

  return formattedDate;
};
