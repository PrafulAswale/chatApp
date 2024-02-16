import React, { useState, useEffect } from "react";
import client, { databases } from "../appwrite/config";
import config from "../config/config";
import { ID, Query, Permission, Role } from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

const Room = () => {
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${config.appwriteDatabaseId}.collections.${config.appwriteCollectionId}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setMessages((prevState) => [response.payload, ...prevState]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const getMessages = async () => {
    const response = await databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(100)]
    );
    setMessages(response.documents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const permissions = [Permission.write(Role.user(user.$id))];
    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    let response = await databases.createDocument(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      ID.unique(),
      payload,
      permissions
    );
    // setMessages((prevState) => [response, ...messages]);
    setMessageBody("");
  };

  const deleteMessage = async (id) => {
    await databases.deleteDocument(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      id
    );
  };
  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form id="messages--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength={1000}
              placeholder="Message"
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            />
          </div>
          <div className="send-btn--wrapper">
            <input type="submit" className="btn btn--secondary" value="Send" />
          </div>
        </form>
        <div>
          {messages.map((message) => (
            <div key={message.$id} className={"message--wrapper"}>
              <div className="message--header">
                <p>
                  {message?.username ? (
                    <span> {message?.username}</span>
                  ) : (
                    "Anonymous user"
                  )}

                  <small className="message-timestamp">
                    {" "}
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>

                {message.$permissions.includes(
                  `delete(\"user:${user.$id}\")`
                ) && (
                  <Trash2
                    className="delete--btn"
                    onClick={() => {
                      deleteMessage(message.$id);
                    }}
                  />
                )}
              </div>

              <div
                className={
                  "message--body" +
                  (message.user_id === user.$id ? " message--body--owner" : "")
                }
              >
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Room;
