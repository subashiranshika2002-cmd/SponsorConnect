import { useEffect, useState } from "react";
import "./Messages.css";

const API_URL = "http://localhost:5000/api/messages";

async function readResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Unable to complete the request.");
  }

  return data;
}

function Conversation({ conversation, user, token }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [sendError, setSendError] = useState("");
  const [refresh, setRefresh] = useState(0);

  const currentUserId = String(user.user_id || user._id || "");

  useEffect(() => {
    const controller = new AbortController();

    async function loadMessages() {
      setLoading(true);
      setLoadError("");

      try {
        const response = await fetch(
          `${API_URL}/${conversation._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const data = await readResponse(response);

        if (!Array.isArray(data.messages)) {
          throw new Error("Unexpected message response.");
        }

        if (!controller.signal.aborted) {
          setMessages(data.messages);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoadError(error.message || "Unable to load messages.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMessages();

    return () => controller.abort();
  }, [conversation._id, token, refresh]);

  async function sendMessage(event) {
    event.preventDefault();

    if (!text.trim() || sending) return;

    setSending(true);
    setSendError("");

    try {
      const response = await fetch(
        `${API_URL}/${conversation._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: text.trim() }),
          signal: AbortSignal.timeout(15000),
        }
      );

      const data = await readResponse(response);

      if (!data.message?._id) {
        throw new Error("Unexpected message response. Refresh the chat.");
      }

      setMessages((previous) =>
        [...previous, data.message].slice(-100)
      );
      setText("");
    } catch (error) {
      setSendError(
        error.name === "TimeoutError" || error instanceof TypeError
          ? "Could not confirm sending. Refresh the chat before trying again."
          : error.message
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="sc-chat" aria-label="Conversation">
      <header className="sc-chat-header">
        <div>
          <h2>{conversation.company?.name || "Company"}</h2>
          <p>{conversation.eventName}</p>
          <small>
            Organizer: {conversation.organizer?.full_name || "Unavailable"}
          </small>
        </div>

        <button
          type="button"
          className="text-button"
          disabled={loading || sending}
          onClick={() => setRefresh((value) => value + 1)}
        >
          Refresh chat
        </button>
      </header>

      {loading && <p role="status">Loading messages...</p>}

      {loadError && (
        <p className="notice error" role="alert">
          {loadError}
        </p>
      )}

      {!loading && !loadError && (
        <div className="sc-chat-history">
          {messages.length === 0 && (
            <p>No messages yet. Start the conversation below.</p>
          )}

          {messages.map((message) => {
            const senderId = String(
              message.sender?._id || message.sender || ""
            );

            const mine =
              currentUserId !== "" && senderId === currentUserId;

            return (
              <article
                key={message._id}
                className={`sc-chat-bubble ${mine ? "sc-chat-mine" : ""}`}
              >
                <strong>
                  {mine ? "You" : message.sender?.full_name || "Participant"}
                </strong>

                <p>{message.text}</p>

                <time dateTime={message.createdAt}>
                  {new Date(message.createdAt).toLocaleString()}
                </time>
              </article>
            );
          })}
        </div>
      )}

      <form className="sc-chat-form" onSubmit={sendMessage}>
        <label htmlFor="chat-message">Your message</label>

        <textarea
          id="chat-message"
          value={text}
          onChange={(event) => setText(event.target.value)}
          maxLength={2000}
          rows={3}
          placeholder="Discuss your sponsorship proposal..."
          disabled={sending || loading || Boolean(loadError)}
          required
        />

        <button
          type="submit"
          className="primary-button"
          disabled={
            sending || loading || Boolean(loadError) || !text.trim()
          }
        >
          {sending ? "Sending..." : "Send message"}
        </button>
      </form>

      {sendError && (
        <p className="notice error" role="alert">
          {sendError}
        </p>
      )}

      <small className="sc-chat-help">
        Use Refresh chat to check for new replies.
      </small>
    </section>
  );
}

function Messages({ user, token }) {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadConversations() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_URL}/conversations`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
          cache: "no-store",
        });

        const data = await readResponse(response);

        if (!Array.isArray(data.conversations)) {
          throw new Error("Unexpected conversation response.");
        }

        if (!controller.signal.aborted) {
          setConversations(data.conversations);
          setSelectedId((previous) =>
            data.conversations.some((item) => item._id === previous)
              ? previous
              : data.conversations[0]?._id || ""
          );
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setError(error.message || "Unable to load conversations.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadConversations();

    return () => controller.abort();
  }, [token, refresh]);

  if (loading) {
    return <p role="status">Loading conversations...</p>;
  }

  if (error) {
    return (
      <section className="dashboard-section">
        <p className="notice error" role="alert">{error}</p>
        <button
          type="button"
          className="text-button"
          onClick={() => setRefresh((value) => value + 1)}
        >
          Try again
        </button>
      </section>
    );
  }

  if (conversations.length === 0) {
    return (
      <section className="dashboard-section">
        <h2>No conversations yet</h2>
        <p>
          {user.role === "company"
            ? "Conversations appear when your account is assigned to a company and that company receives a sponsorship request."
            : "Submit a sponsorship request through My requests first. Then return here to discuss it."}
        </p>
      </section>
    );
  }

  const selected = conversations.find(
    (item) => item._id === selectedId
  );

  return (
    <div className="sc-messages-layout">
      <aside className="sc-conversation-list">
        <h2>Conversations</h2>

        {conversations.map((conversation) => (
          <button
            type="button"
            key={conversation._id}
            className={
              selectedId === conversation._id
                ? "sc-conversation active"
                : "sc-conversation"
            }
            aria-pressed={selectedId === conversation._id}
            onClick={() => setSelectedId(conversation._id)}
          >
            <strong>{conversation.company?.name || "Company"}</strong>
            <span>{conversation.eventName}</span>
          </button>
        ))}
      </aside>

      {selected && (
        <Conversation
          key={selected._id}
          conversation={selected}
          user={user}
          token={token}
        />
      )}
    </div>
  );
}

export default Messages;