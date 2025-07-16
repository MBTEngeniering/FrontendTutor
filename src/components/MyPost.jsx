import React, { useEffect, useState } from "react";
import ApiService from "../api/ApiService.js";

const MyPost = ({ userId }) => {
    const [post, setPost] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [userMap, setUserMap] = useState({}); // Speichert ID -> User

    useEffect(() => {
        const fetchPostAndUsers = async () => {
            try {
                const gesendetMessage = await ApiService.get(`/api/public/post/sender/${userId}`);
                const empfangMessage = await ApiService.get(`/api/public/post/empfaenger/${userId}`);

                const posts = [...gesendetMessage.data, ...empfangMessage.data];
                setPost(posts);

                // Alle eindeutigen User-IDs sammeln
                const uniqueIds = new Set();
                posts.forEach(p => {
                    uniqueIds.add(p.sender);
                    uniqueIds.add(p.empfaenger);
                });

                // Alle User abrufen
                const userRequests = Array.from(uniqueIds).map(id =>
                    ApiService.get(`/api/allusers/${id}`)
                );
                const userResponses = await Promise.all(userRequests);

                const userMap = {};
                userResponses.forEach(res => {
                    const user = res.data;
                    userMap[user.id] = user;
                });
                setUserMap(userMap);
            } catch (error) {
                console.error("Fehler beim Laden:", error);
            }
        };

        fetchPostAndUsers();
    }, [userId]);

    return (
        <div style={{ padding: "20px", display: "flex", height: "300px" }}>
            {/* Linke Box */}
            <div
                style={{
                    flex: 1,
                    borderRight: "2px solid black",
                    paddingRight: "10px",
                    overflowY: "auto",
                }}
            >
                <h2>Meine Nachrichten</h2>
                {post.length > 0 ? (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {post.map(p => {
                            const otherId = p.sender !== userId ? p.sender : p.empfaenger;
                            const user = userMap[otherId];
                            return (
                                <li
                                    key={p.id}
                                    onClick={() => setSelectedId(p.id)}
                                    style={{
                                        cursor: "pointer",
                                        padding: "5px",
                                        backgroundColor: p.id === selectedId ? "#ddd" : "transparent",
                                    }}
                                >
                                    {user ? `${user.firstName} ${user.lastName}` : `Lädt...`}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Keine Nachricht noch.</p>
                )}
            </div>

            {/* Rechte Box */}
            <div
                style={{
                    flex: 3,
                    paddingLeft: "10px",
                    height: "300px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {post.find(p => p.id === selectedId) ? (
                    <>
                        <p>
                            <strong>Nachricht:</strong>
                        </p>
                        <ul>
                            {post
                                .find(p => p.id === selectedId)
                                .nachrichten.map((nachricht, index) => (
                                    <li key={index}>{nachricht.text}</li>
                                ))}
                        </ul>

                        <textarea
                            placeholder="Neue Nachricht schreiben..."
                            style={{
                                resize: "horizontal",
                                height: "150px",
                                marginTop: "200px",
                                width: "100%",
                                overflowY: "auto",
                                flexShrink: 0,
                            }}
                        />
                    </>
                ) : (
                    <p>Bitte wähle eine Nachricht aus der Liste.</p>
                )}
            </div>
        </div>
    );
};

export default MyPost;
