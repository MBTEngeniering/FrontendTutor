import React, { useCallback, useEffect, useRef, useState } from "react";
import ApiService from "../api/ApiService.js";
import { useNavigate } from "react-router-dom";

const MyPost = ({ userId }) => {
    const [post, setPost] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [userMap, setUserMap] = useState({}); // Speichert ID -> User
    const [loadedForUserId, setLoadedForUserId] = useState(null);
    const isMountedRef = useRef(false);
    const fetchedForUserIdRef = useRef(null); // verhindert doppelten Abruf durch StrictMode
    const isLoading = Boolean(userId) && loadedForUserId !== userId;
    const navigate = useNavigate();

    const fetchPostAndUsers = useCallback(async () => {
        try {
            const gesendetMessage = await ApiService.get(`/api/public/post/sender/${userId}`);
            const empfangMessage = await ApiService.get(`/api/public/post/empfaenger/${userId}`);

            // Ein Beitrag kann in beiden Antworten vorkommen, daher Duplikate anhand der ID entfernen
            const posts = Array.from(
                new Map([...gesendetMessage.data, ...empfangMessage.data].map(p => [p.id, p])).values()
            );
            if (!isMountedRef.current) {
                return;
            }

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
            if (isMountedRef.current) {
                setUserMap(userMap);
            }
        } catch (error) {
            if (!isMountedRef.current) {
                return;
            }
            console.error("Fehler beim Laden:", error);
            if (error.response && error.response.status === 401) {
                navigate("/login");
            }
        } finally {
            if (isMountedRef.current) {
                setLoadedForUserId(userId);
            }
        }
    }, [userId, navigate]);

    useEffect(() => {
        if (!userId) {
            return;
        }

        isMountedRef.current = true;

        // StrictMode führt den Effekt in der Entwicklung zweimal aus, die Ref bleibt dabei erhalten.
        if (fetchedForUserIdRef.current !== userId) {
            fetchedForUserIdRef.current = userId;
            fetchPostAndUsers();
        }

        return () => {
            isMountedRef.current = false;
        };
    }, [userId, fetchPostAndUsers]);

    return (
        <>
        <h2>Meine Nachrichten</h2>
        <div style={{ padding: "10px", display: "flex", height: "auto" }}>
            {/* Linke Box */}
            <div
                style={{
                    flex: 1,
                    borderRight: "2px solid black",
                    paddingRight: "10px",
                    overflowY: "auto",
                }}
            >
                {isLoading ? (
                    <p>Lädt...</p>
                ) : post.length > 0 ? (
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
                    <p>Keine Nachrichten vorhanden.</p>
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
        </>
    );
};

export default MyPost;
