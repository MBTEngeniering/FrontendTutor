import React from "react";

export default function MeineNachricht({ post, selectedId, setSelectedId }) {
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
                                {p.id}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Keine Nachricht noch.</p>
                )}
            </div>

            {/* Rechte Box mit Nachrichten der ausgewählten ID */}
            <div style={{ flex: 2, paddingLeft: "10px", overflowY: "auto" }}>
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
                    </>
                ) : (
                    <p>Bitte wähle eine ID aus der linken Liste.</p>
                )}
            </div>
        </div>
    );
}
