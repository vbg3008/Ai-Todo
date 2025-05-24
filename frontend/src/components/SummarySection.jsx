import React, { useState } from "react";

const SummarySection = ({
  generateSummary,
  sendToSlack,
  summary,
  isLoading,
}) => {
  const [slackStatus, setSlackStatus] = useState(null);

  // Function to render text with bold formatting for **text**
  const renderFormattedText = (text) => {
    if (!text) return text;

    // Split text by ** markers and process each part
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      // If part starts and ends with **, make it bold
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2); // Remove ** from both ends
        return <strong key={index}>{boldText}</strong>;
      }
      // Otherwise return as regular text
      return part;
    });
  };

  const handleSendToSlack = async () => {
    try {
      setSlackStatus({ type: "loading", message: "Sending to Slack..." });
      await sendToSlack();
      setSlackStatus({
        type: "success",
        message: "Successfully sent to Slack!",
      });
    } catch (error) {
      console.error("Error sending to Slack:", error);
      setSlackStatus({
        type: "error",
        message: `Failed to send to Slack: ${
          error.response?.data?.message || error.message
        }`,
      });
    }
  };
  return (
    <div className="summary-section">
      <h2>Todo Summary</h2>

      <div className="summary-actions">
        <button
          onClick={generateSummary}
          className="btn btn-primary"
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Generate Summary"}
        </button>

        <button
          onClick={handleSendToSlack}
          className="btn btn-secondary"
          disabled={isLoading || !summary || slackStatus?.type === "loading"}
        >
          {slackStatus?.type === "loading" ? "Sending..." : "Send to Slack"}
        </button>

        {slackStatus && (
          <div className={`slack-status ${slackStatus.type}`}>
            {slackStatus.message}
          </div>
        )}
      </div>

      <div className="summary-content">
        {summary ? (
          <div className="summary-box">
            <h3>Summary</h3>
            <div className="summary-text">
              {summary.split("\n").map((line, index) => (
                <p key={index}>{renderFormattedText(line)}</p>
              ))}
            </div>
          </div>
        ) : (
          <p className="summary-placeholder">
            Click "Generate Summary" to create a summary of your pending todos.
          </p>
        )}
      </div>
    </div>
  );
};

export default SummarySection;
