import React, { useEffect, useState } from "react";
import ApiService    from "../api/ApiService.js";

const MyPost = ({ userId }) => {
    const [post, setPost] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const gesendetMessage = await ApiService.get(`/api/public/post/sender/${userId}`);
                const empfangMessage = await ApiService.get(`/api/public/post/empfaenger/${userId}`);

                const schowSendet = gesendetMessage.data;
                const schowRecieved = empfangMessage.data;
                const posts = [...schowSendet, ...schowRecieved];

                setPost(posts);
            } catch (error) {
                console.error("Fehler beim Laden der Nachrichten:", error);
                setPost([]);
            }
        };

        fetchPost();
    }, [userId]);

    return (
        <div style={{ padding: "20px", display: "flex", height: "300px" }}>
            {/* Linke Box mit ID-Liste */}
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
                        {post.map((p) => (
                            <li
                                key={p.id}
                                onClick={() => setSelectedId(p.id)}
                                style={{
                                    cursor: "pointer",
                                    padding: "5px",
                                    backgroundColor: p.id === selectedId ? "#ddd" : "transparent",
                                }}
                            >
                                {p.sender !== userId ? p.sender : p.empfaenger}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Keine Nachricht noch.</p>
                )}
            </div>

            {/* Rechte Box mit Nachrichten-Details */}
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
                {post.find((p) => p.id === selectedId) ? (
                    <>
                        <p>
                            <strong>Nachricht:</strong>
                        </p>
                        <ul>
                            {post
                                .find((p) => p.id === selectedId)
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
                    <p>Bitte wähle eine ID aus der linken Liste.</p>
                )}
            </div>
        </div>
    );
};

export default MyPost;
