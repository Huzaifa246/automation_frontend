import axios from 'axios';
import React, { useState, useEffect } from 'react';

const ChatArea = ({ fileData, className }: { fileData: any; className: string }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastProcessedFileId, setLastProcessedFileId] = useState<string | null>(null);

  //working code
  // const handleSend = async () => {
  //   if (!fileData) {
  //     alert("Please select a file first!");
  //     return;
  //   }
  
  //   setMessages((prevMessages) => [
  //     ...prevMessages,
  //     { role: "user", content: userInput },
  //   ]);
  //   setLoading(true);
  
  //   try {
  //     // Define max payload size per request (e.g., 50 KB)
  //     const MAX_PAYLOAD_SIZE_BYTES = 50000;
  
  //     // Create smaller chunks of articles to match server's size limit
  //     const createChunks = (
  //       articles: { [key: string]: any }[],
  //       maxSizeBytes: number
  //     ): { [key: string]: any }[][] => {
  //       const chunks: { [key: string]: any }[][] = [];
  //       let currentChunk: { [key: string]: any }[] = [];
  //       let currentSize = 0;
  
  //       articles.forEach((article) => {
  //         const articleSize = JSON.stringify(article).length;
  //         if (currentSize + articleSize <= maxSizeBytes) {
  //           currentChunk.push(article);
  //           currentSize += articleSize;
  //         } else {
  //           chunks.push(currentChunk);
  //           currentChunk = [article];
  //           currentSize = articleSize;
  //         }
  //       });
  
  //       if (currentChunk.length > 0) {
  //         chunks.push(currentChunk);
  //       }
  //       return chunks;
  //     };
  
  //     const articleChunks = createChunks(fileData.articles, MAX_PAYLOAD_SIZE_BYTES);
  
  //     // Properly define the types for finalSummary
  //     let finalSummary: {
  //       heading1: string[];
  //       para1: string[];
  //       heading2: string[];
  //       para2: string[];
  //     } = {
  //       heading1: [],
  //       para1: [],
  //       heading2: [],
  //       para2: [],
  //     };
  
  //     console.log(`Total chunks created: ${articleChunks.length}`);
  
  //     for (let i = 0; i < articleChunks.length; i++) {
  //       const chunk = articleChunks[i];
  //       const payload = { selectedBatch: { articles: chunk } };
  //       const payloadSize = JSON.stringify(payload).length;
  
  //       console.log(
  //         `Processing chunk ${i + 1}/${articleChunks.length}, size: ${payloadSize} bytes`
  //       );
  
  //       const response = await fetch("http://localhost:5000/api/generate-summary", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(payload),
  //       });
  
  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         console.error(`Error in chunk ${i + 1}:`, errorData);
  //         // throw new Error(
  //         //   errorData.error || "Failed to generate summary for chunk"
  //         // );
  //         setMessages((prevMessages) => [
  //           ...prevMessages,
  //           {
  //             role: "assistant",
  //             content: `Error: ${
  //               errorData.error || "Failed to generate summary for chunk"
  //             }`,
  //           },
  //         ]);
  //         return; 
  //       }
  
  //       const data = await response.json();
  //       const { summary } = data;
  
  //       // Combine the summaries from all chunks
  //       if (summary.heading1) finalSummary.heading1.push(summary.heading1.trim());
  //       if (summary.para1) finalSummary.para1.push(summary.para1.trim());
  //       if (summary.heading2) finalSummary.heading2.push(summary.heading2.trim());
  //       if (summary.para2) finalSummary.para2.push(summary.para2.trim());
  //     }
  
  //     const filterSimilar = (array: string[]): string[] => {
  //       const seen = new Set<string>();
  //       return array.filter((item) => {
  //         const normalized = item.toLowerCase().trim();
  //         if (seen.has(normalized)) return false;
  //         seen.add(normalized);
  //         return true;
  //       });
  //     };
  
  //     const formattedSummary = {
  //       heading1: filterSimilar(finalSummary.heading1).join(", "),
  //       para1: filterSimilar(finalSummary.para1).join("\n\n"),
  //       heading2: filterSimilar(finalSummary.heading2).join(", "),
  //       para2: filterSimilar(finalSummary.para2).join("\n\n"),
  //     };
  
  //     // Display the final combined summary
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         role: "assistant",
  //         content: `
  //           **Heading 1:** ${formattedSummary.heading1}\n\n
  //           **Paragraph 1:**\n${formattedSummary.para1}\n\n
  //           **Heading 2:** ${formattedSummary.heading2}\n\n
  //           **Paragraph 2:**\n${formattedSummary.para2}\n\n
  //         `.trim(),
  //       },
  //     ]);
  //   } catch (error: any) {
  //     console.error("Error in handleSend:", error.message);
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         role: "assistant",
  //         content: `Error: ${
  //           error.message || "Failed to process the request. Please try again."
  //         }`,
  //       },
  //     ]);
  //   } finally {
  //     setUserInput("");
  //     setLoading(false);
  //   }
  // };
  
  //latest working code
  const handleSend = async () => {
    if (!fileData) {
      alert("Please select a file first!");
      return;
    }
  
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: "user", content: userInput },
    ]);
    setLoading(true);
  
    try {
      const MAX_PAYLOAD_SIZE_BYTES = 500000;
  
      const createChunks = (
        articles: Array<{ [key: string]: any }>,
        maxSizeBytes: number
      ): Array<Array<{ [key: string]: any }>> => {
        const chunks: Array<Array<{ [key: string]: any }>> = [];
        let currentChunk: Array<{ [key: string]: any }> = [];
        let currentSize: number = 0;
  
        articles.forEach((article) => {
          const articleSize = JSON.stringify(article).length;

          if (articleSize > maxSizeBytes) {
            console.warn("Skipping article due to large size:", article);
            return;
          }
          if (currentSize + articleSize <= maxSizeBytes) {
            currentChunk.push(article);
            currentSize += articleSize;
          } else {
            chunks.push(currentChunk);
            currentChunk = [article];
            currentSize = articleSize;
          }
        });
  
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
        }
        return chunks;
      };
  
      const articleChunks = createChunks(
        fileData.articles as Array<{ [key: string]: any }>,
        MAX_PAYLOAD_SIZE_BYTES
      );
  
      console.log(`Total chunks created: ${articleChunks.length}`);
  
      const finalResponse = await fetch("http://localhost:5000/api/generate-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ allBatches: articleChunks.map((chunk) => ({ articles: chunk })) }),
      });
  
      if (!finalResponse.ok) {
        const errorData = await finalResponse.json();
        throw new Error(errorData.error || "Failed to generate summary.");
      }
  
      const { unifiedSummary, individualSummaries } = await finalResponse.json();
  
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: `
          **Heading 1:** 
          ${unifiedSummary.heading1}
          
          **Paragraph 1:** 
          ${unifiedSummary.para1}
  
          **Heading 2:** 
          ${unifiedSummary.heading2}
          
          **Paragraph 2:** 
          ${unifiedSummary.para2}
  
          `.trim(),
        },
      ]);
    } catch (error: any) {
      console.error("Error in handleSend:", error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: `Error: ${error.message || "Failed to process the request. Please try again."}`,
        },
      ]);
    } finally {
      setUserInput("");
      setLoading(false);
    }
  };
  
  // const handleSend = async () => {
  //   if (!fileData) {
  //     alert("Please select a file first!");
  //     return;
  //   }
  
  //   setMessages((prevMessages) => [
  //     ...prevMessages,
  //     { role: "user", content: userInput },
  //   ]);
  //   setLoading(true);
  
  //   try {
  //     const MAX_PAYLOAD_SIZE_BYTES = 500000; // Max size of each payload in bytes
  
  //     // Function to split articles into chunks based on size
  //     const createChunks = (
  //       articles: Array<{ [key: string]: any }>,
  //       maxSizeBytes: number
  //     ): Array<Array<{ [key: string]: any }>> => {
  //       const chunks: Array<Array<{ [key: string]: any }>> = [];
  //       let currentChunk: Array<{ [key: string]: any }> = [];
  //       let currentSize: number = 0;
  
  //       articles.forEach((article) => {
  //         const articleSize = JSON.stringify(article).length;
  
  //         if (articleSize > maxSizeBytes) {
  //           console.warn("Skipping article due to large size:", article);
  //           return;
  //         }
  
  //         if (currentSize + articleSize <= maxSizeBytes) {
  //           currentChunk.push(article);
  //           currentSize += articleSize;
  //         } else {
  //           chunks.push(currentChunk);
  //           currentChunk = [article];
  //           currentSize = articleSize;
  //         }
  //       });
  
  //       if (currentChunk.length > 0) {
  //         chunks.push(currentChunk);
  //       }
  //       return chunks;
  //     };
  
  //     // Split file data into manageable chunks
  //     const articleChunks = createChunks(
  //       fileData.articles as Array<{ [key: string]: any }>,
  //       MAX_PAYLOAD_SIZE_BYTES
  //     );
  
  //     console.log(`Total chunks created: ${articleChunks.length}`);
  
  //     // Send chunks to the backend one by one
  //     const responses = [];
  //     for (let i = 0; i < articleChunks.length; i++) {
  //       const chunk = articleChunks[i];
  //       console.log(`Sending chunk ${i + 1}/${articleChunks.length}...`);
  
  //       const response = await fetch("http://localhost:5000/api/generate-summary", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ allBatches: [{ articles: chunk }] }),
  //       });
  
  //       if (!response.ok) {
  //         const errorData = await response.json();
  //         console.error(`Error with chunk ${i + 1}:`, errorData.error);
  //         throw new Error(errorData.error || `Chunk ${i + 1} failed.`);
  //       }
  
  //       const result = await response.json();
  //       responses.push(result);
  //     }
  
  //     // Combine summaries from all responses
  //     const unifiedSummary = responses.map((res) => res.unifiedSummary).join("\n\n");
  //     const individualSummaries = responses.flatMap((res) => res.individualSummaries);
  
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         role: "assistant",
  //         content: `
  // **Unified Summary:**
  
  // ${unifiedSummary}
  
  // **Individual Summaries:**
  
  // ${individualSummaries.map((summary, idx) => `Summary ${idx + 1}: ${summary}`).join("\n\n")}
  //       `.trim(),
  //       },
  //     ]);
  //   } catch (error: any) {
  //     console.error("Error in handleSend:", error.message);
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         role: "assistant",
  //         content: `Error: ${error.message || "Failed to process the request. Please try again."}`,
  //       },
  //     ]);
  //   } finally {
  //     setUserInput("");
  //     setLoading(false);
  //   }
  // };

  const saveArticle = async () => {
    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || !lastMessage.content) {
      alert('No content available to save.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/save-article', {
        content: lastMessage.content,
      });

      alert(`Article saved successfully! ID: ${response.data.id}`);
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Failed to save the article. Please try again.');
    }
  };



  useEffect(() => {
    if (fileData && fileData.articles && fileData.id !== lastProcessedFileId) {
      setLastProcessedFileId(fileData.id);
    }
  }, [fileData]);
  return (
    <div className={`flex flex-col w-full h-full bg-gray-500 p-4 ${className}`}>
      <h2 className="text-lg font-bold mb-4">
        Chat for: <span className="text-blue-400">{fileData?.fileName || 'Unknown File'}</span>
      </h2>

      <div className="flex-1 overflow-y-scroll mb-4 bg-white p-4 rounded-lg max-h-[700px]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 mb-2 rounded-md ${message.role === 'user' ? 'bg-blue-200 text-right' : 'bg-green-200 text-left'
              }`}
          >
            {message.content}
          </div>
        ))}

        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={saveArticle}
        >
          Save Article
        </button>

        {loading && (
          <div className="flex justify-center items-center">
            <div className="loader border-t-blue-500 border-4 border-solid rounded-full w-8 h-8 animate-spin"></div>
          </div>
        )}
      </div>

      <div className="flex items-center">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your prompt here..."
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className={`bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
