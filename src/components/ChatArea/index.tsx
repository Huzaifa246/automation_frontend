import axios from 'axios';
import React, { useState } from 'react';

const ChatArea = ({ fileData, className }: { fileData: any; className: string }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  // payload size error
  //   const handleSend = async () => {
  //     if (!fileData) {
  //         alert("Please select a file first!");
  //         return;
  //     }

  //     setMessages((prevMessages) => [
  //         ...prevMessages,
  //         { role: "user", content: userInput },
  //     ]);
  //     setLoading(true);

  //     try {
  //         const chunkSize = 5; // Number of articles per chunk
  //         const articleChunks: any[] = [];

  //         // Split the articles into chunks
  //         for (let i = 0; i < fileData.articles.length; i += chunkSize) {
  //             articleChunks.push(fileData.articles.slice(i, i + chunkSize));
  //         }

  //         let finalSummary = {
  //             heading1: new Set<string>(),
  //             para1: new Set<string>(),  
  //             heading2: new Set<string>(),
  //             para2: new Set<string>(),  
  //             metatitle: "",
  //             metadescription: "",
  //             tags: "",
  //         };

  //         for (const chunk of articleChunks) {
  //             // Send each chunk to the backend
  //             const response = await fetch("http://localhost:5000/api/generate-summary", {
  //                 method: "POST",
  //                 headers: {
  //                     "Content-Type": "application/json",
  //                 },
  //                 body: JSON.stringify({ selectedBatch: { articles: chunk } }),
  //             });

  //             if (!response.ok) {
  //                 const errorData = await response.json();
  //                 throw new Error(errorData.error || "Failed to generate summary for chunk");
  //             }

  //             const data = await response.json();
  //             const { summary } = data;

  //             // Combine the summaries from all chunks
  //             if (summary.heading1) finalSummary.heading1.add(summary.heading1.trim());
  //             if (summary.para1) finalSummary.para1.add(summary.para1.trim());
  //             if (summary.heading2) finalSummary.heading2.add(summary.heading2.trim());
  //             if (summary.para2) finalSummary.para2.add(summary.para2.trim());
  //             finalSummary.metatitle = summary.metatitle || finalSummary.metatitle;
  //             finalSummary.metatitle = summary.metatitle || finalSummary.metatitle;
  //             finalSummary.metadescription =
  //                 summary.metadescription || finalSummary.metadescription;
  //             finalSummary.tags = summary.tags || finalSummary.tags;
  //         }

  //         const uniqueJoin = (set: Set<string>): string => Array.from(set).join(",\n");

  //         const formattedSummary = {
  //             heading1: uniqueJoin(finalSummary.heading1),
  //             para1: uniqueJoin(finalSummary.para1),
  //             heading2: uniqueJoin(finalSummary.heading2),
  //             para2: uniqueJoin(finalSummary.para2),
  //             metatitle: finalSummary.metatitle.trim(),
  //             metadescription: finalSummary.metadescription.trim(),
  //             tags: finalSummary.tags.trim(),
  //         };

  //         // Display the final combined summary as assistant's response
  //         setMessages((prevMessages) => [
  //             ...prevMessages,
  //             {
  //                 role: "assistant",
  //                 content: `Heading 1: ${formattedSummary.heading1}  
  //                           Paragraph 1: ${formattedSummary.para1}
  //                           Heading 2: ${formattedSummary.heading2}
  //                           Paragraph 2: ${formattedSummary.para2}
  //                           Meta Title: ${formattedSummary.metatitle}
  //                           Meta Description: ${formattedSummary.metadescription}
  //                           Tags: ${formattedSummary.tags}`,
  //             },
  //         ]);
  //     } catch (error: any) {
  //         console.error("Error in handleSend:", error.message);
  //         setMessages((prevMessages) => [
  //             ...prevMessages,
  //             {
  //                 role: "assistant",
  //                 content: `Error: ${error.message || "Failed to process the request. Please try again."}`,
  //             },
  //         ]);
  //     } finally {
  //         setUserInput("");
  //         setLoading(false);
  //     }
  // };

  //
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
  //       articles: { [key: string]: any }[], // Assuming each article is an object
  //       maxSizeBytes: number
  //     ): { [key: string]: any }[][] => {
  //       const chunks: { [key: string]: any }[][] = [];
  //       let currentChunk: { [key: string]: any }[] = [];
  //       let currentSize = 0;

  //       articles.forEach((article: { [key: string]: any }) => {
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

  //     let finalSummary = {
  //       heading1: new Set<string>(),
  //       para1: new Set<string>(),
  //       heading2: new Set<string>(),
  //       para2: new Set<string>(),
  //       metatitle: "",
  //       metadescription: "",
  //       tags: "",
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
  //         throw new Error(
  //           errorData.error || "Failed to generate summary for chunk"
  //         );
  //       }

  //       const data = await response.json();
  //       const { summary } = data;

  //       // Combine the summaries from all chunks
  //       if (summary.heading1) finalSummary.heading1.add(summary.heading1.trim());
  //       if (summary.para1) finalSummary.para1.add(summary.para1.trim());
  //       if (summary.heading2) finalSummary.heading2.add(summary.heading2.trim());
  //       if (summary.para2) finalSummary.para2.add(summary.para2.trim());
  //       finalSummary.metatitle = summary.metatitle || finalSummary.metatitle;
  //       finalSummary.metadescription =
  //         summary.metadescription || finalSummary.metadescription;
  //       finalSummary.tags = summary.tags || finalSummary.tags;
  //     }

  //     const uniqueJoin = (set: Set<string>): string =>
  //       Array.from(set).join(",\n");

  //     const formattedSummary = {
  //       heading1: uniqueJoin(finalSummary.heading1),
  //       para1: uniqueJoin(finalSummary.para1),
  //       heading2: uniqueJoin(finalSummary.heading2),
  //       para2: uniqueJoin(finalSummary.para2),
  //       metatitle: finalSummary.metatitle.trim(),
  //       metadescription: finalSummary.metadescription.trim(),
  //       tags: finalSummary.tags.trim(),
  //     };

  //     // Display the final combined summary
  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         role: "assistant",
  //         content: `Heading 1: ${formattedSummary.heading1}  
  //                   Paragraph 1: ${formattedSummary.para1}
  //                   Heading 2: ${formattedSummary.heading2}
  //                   Paragraph 2: ${formattedSummary.para2}
  //                   Meta Title: ${formattedSummary.metatitle}
  //                   Meta Description: ${formattedSummary.metatitle}
  //                   Tags: ${formattedSummary.tags}`,
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
      // Define max payload size per request (e.g., 50 KB)
      const MAX_PAYLOAD_SIZE_BYTES = 50000;
  
      // Create smaller chunks of articles to match server's size limit
      const createChunks = (
        articles: { [key: string]: any }[],
        maxSizeBytes: number
      ): { [key: string]: any }[][] => {
        const chunks: { [key: string]: any }[][] = [];
        let currentChunk: { [key: string]: any }[] = [];
        let currentSize = 0;
  
        articles.forEach((article) => {
          const articleSize = JSON.stringify(article).length;
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
  
      const articleChunks = createChunks(fileData.articles, MAX_PAYLOAD_SIZE_BYTES);
  
      // Properly define the types for finalSummary
      let finalSummary: {
        heading1: string[];
        para1: string[];
        heading2: string[];
        para2: string[];
        metatitle: string;
        metadescription: string;
        tags: string[];
      } = {
        heading1: [],
        para1: [],
        heading2: [],
        para2: [],
        metatitle: "",
        metadescription: "",
        tags: [],
      };
  
      console.log(`Total chunks created: ${articleChunks.length}`);
  
      for (let i = 0; i < articleChunks.length; i++) {
        const chunk = articleChunks[i];
        const payload = { selectedBatch: { articles: chunk } };
        const payloadSize = JSON.stringify(payload).length;
  
        console.log(
          `Processing chunk ${i + 1}/${articleChunks.length}, size: ${payloadSize} bytes`
        );
  
        const response = await fetch("http://localhost:5000/api/generate-summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Error in chunk ${i + 1}:`, errorData);
          throw new Error(
            errorData.error || "Failed to generate summary for chunk"
          );
        }
  
        const data = await response.json();
        const { summary } = data;
  
        // Combine the summaries from all chunks
        if (summary.heading1) finalSummary.heading1.push(summary.heading1.trim());
        if (summary.para1) finalSummary.para1.push(summary.para1.trim());
        if (summary.heading2) finalSummary.heading2.push(summary.heading2.trim());
        if (summary.para2) finalSummary.para2.push(summary.para2.trim());
        finalSummary.metatitle = summary.metatitle || finalSummary.metatitle;
        finalSummary.metadescription =
          summary.metadescription || finalSummary.metadescription;
        if (summary.tags) finalSummary.tags.push(...summary.tags.split(","));
      }
  
      const filterSimilar = (array: string[]): string[] => {
        const seen = new Set<string>();
        return array.filter((item) => {
          const normalized = item.toLowerCase().trim();
          if (seen.has(normalized)) return false;
          seen.add(normalized);
          return true;
        });
      };
  
      const formattedSummary = {
        heading1: filterSimilar(finalSummary.heading1).join(", "),
        para1: filterSimilar(finalSummary.para1).join("\n\n"),
        heading2: filterSimilar(finalSummary.heading2).join(", "),
        para2: filterSimilar(finalSummary.para2).join("\n\n"),
        metatitle: finalSummary.metatitle.trim(),
        metadescription: finalSummary.metadescription.trim(),
        tags: filterSimilar(finalSummary.tags).join(", "),
      };
  
      // Display the final combined summary
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: `
            **Heading 1:** ${formattedSummary.heading1}\n\n
            **Paragraph 1:**\n${formattedSummary.para1}\n\n
            **Heading 2:** ${formattedSummary.heading2}\n\n
            **Paragraph 2:**\n${formattedSummary.para2}\n\n
            **Meta Title:** ${formattedSummary.metatitle}\n\n
            **Meta Description:** ${formattedSummary.metadescription}\n\n
            **Tags:** ${formattedSummary.tags}\n
          `.trim(),
        },
      ]);
    } catch (error: any) {
      console.error("Error in handleSend:", error.message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: `Error: ${
            error.message || "Failed to process the request. Please try again."
          }`,
        },
      ]);
    } finally {
      setUserInput("");
      setLoading(false);
    }
  };  

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
