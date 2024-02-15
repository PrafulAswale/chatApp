import React, { useState, useEffect } from "react";
import client, { databases } from "../appwrite/config";
import config from "../config/config";
import { ID, Query, Permission, Role } from "appwrite";

const Room = () => {
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessages();
  });

  const getMessages = async () => {
    const response = await databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteCollectionId
    );
    console.log("RESPONSE:", response);
  };
  return <div>Room</div>;
};

export default Room;
