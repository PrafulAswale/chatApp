import React, { useState, useEffect, useRef } from "react";
import client, { databases } from "../appwrite/config";
import config from "../config/config";
import { ID, Query, Permission, Role } from "appwrite";

import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";
import { Trash2, Send } from "react-feather";
import { account } from "../appwrite/config";

const Room = () => {
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = useAuth();
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    getMessages();
    getAllUsers();
    const unsubscribe = client.subscribe(
      `databases.${config.appwriteDatabaseId}.collections.${config.appwriteCollectionId}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setMessages((prevState) => [...prevState, response.payload]);
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
  }, [messages.length]);

  const getMessages = async () => {
    const response = await databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(100)]
    );
    setMessages(response.documents);
  };

  const getAllUsers = async () => {
    //
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
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-screen bg-slate-900">
      <Header />
      <div
        id="messages"
        className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
      >
        {messages.map((message) =>
          message.user_id === user.$id ? (
            <div key={message.$id} className="chat-message">
              <div className="flex items-end justify-end">
                <div className="flex flex-col space-y-2 text-xl max-w-xs mx-2 order-1 items-end">
                  <span className="text-white">{message.username}</span>
                  <div>
                    <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white ">
                      {message.body}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key={message.$id} className="chat-message">
              <div className="flex items-end">
                <div className="flex flex-col space-y-2 text-xl max-w-xs mx-2 order-2 items-start">
                  <span className="text-white">{message.username}</span>

                  <div>
                    <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600">
                      {message.body}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
        <div ref={ref} />
      </div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <div className="relative flex">
          <form
            className="w-full  focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-md py-3"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Write your message!"
              required
              className="w-full h-8 focus:outline-none rounded-md"
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            />

            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <span className="font-bold">Send</span>
                <Send />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Room;
