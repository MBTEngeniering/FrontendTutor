import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyPost = () => {
    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const userId = localStorage.getItem('userId'); // angenommen: gespeichert nach Login

    useEffect(() => {
        if (userId) {
            loadContacts();
        }
    }, [userId]);

    useEffect(() => {
        if (selectedContact) {
            loadMessages(selectedContact);
        }
    }, [selectedContact]);

    const loadContacts = async () => {
        try {
            const sent = await axios.get(`/api/public/post/sender/${userId}`);
            const received = await axios.get(`/api/public/post/empfaenger/${userId}`);
            const uniqueContacts = {};

            [...sent.data, ...received.data].forEach(post => {
                const contact = post.senderId === userId ? post.empfaengerId : post.senderId;
                if (contact && contact !== userId) {
                    uniqueContacts[contact] = true;
                }
            });

            setContacts(Object.keys(uniqueContacts));
        } catch (error) {
            console.error('Fehler beim Laden der Kontakte:', error);
        }
    };

    const loadMessages = async (contactId) => {
        try {
            const sent = await axios.get(`/api/public/post/sender/${userId}`);
            const received = await axios.get(`/api/public/post/empfaenger/${userId}`);

            const filtered = [...sent.data, ...received.data].filter(
                post =>
                    (post.senderId === userId && post.empfaengerId === contactId) ||
                    (post.empfaengerId === userId && post.senderId === contactId)
            );

            // Optional: Sortierung nach Erstellungszeitpunkt (wenn vorhanden)
            filtered.sort((a, b) => new Date(a.timestamp || 0) - new Date(b.timestamp || 0));

            setMessages(filtered);
        } catch (error) {
            console.error('Fehler beim Laden der Nachrichten:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedContact) return;

        try {
            const dto = {
                senderId: userId,
                empfaengerId: selectedContact,
                text: newMessage
            };
            await axios.post('/api/public/post/save', dto);
            setNewMessage('');
            loadMessages(selectedContact);
        } catch (error) {
            console.error('Fehler beim Senden der Nachricht:', error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Linke Seite - Kontakte */}
            <div className="w-1/4 bg-white border-r overflow-y-auto">
                <h2 className="text-xl font-bold p-4">Kontakte</h2>
                <ul>
                    {contacts.map(contactId => (
                        <li
                            key={contactId}
                            onClick={() => setSelectedContact(contactId)}
                            className={`p-3 cursor-pointer hover:bg-gray-200 ${
                                selectedContact === contactId ? 'bg-gray-300 font-bold' : ''
                            }`}
                        >
                            {contactId}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Rechte Seite - Nachrichten */}
            <div className="w-3/4 flex flex-col">
                <div className="flex-grow p-4 overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4">
                        Nachrichten: {selectedContact || '---'}
                    </h2>
                    <div className="space-y-2">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`p-3 rounded-lg max-w-xs ${
                                    msg.senderId === userId
                                        ? 'bg-blue-200 self-end ml-auto'
                                        : 'bg-gray-200 self-start mr-auto'
                                }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Neue Nachricht */}
                {selectedContact && (
                    <div className="p-4 border-t bg-white flex items-center">
                        <input
                            type="text"
                            className="flex-grow border rounded p-2 mr-2"
                            placeholder="Neue Nachricht..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <button
                            onClick={handleSendMessage}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Senden
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyPost;
