"use client";
import { useState, useRef, useEffect } from "react";

import styles from "./create.module.css";

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
    maxParticipants: "",
    eventType: "public",
    requiresVerification: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for input fields
  const descriptionRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  
  // MutationObserver ref
  const observerRef = useRef<MutationObserver | null>(null);
  
  // State for text selection and levels
  const [selectedText, setSelectedText] = useState({ description: "", location: "" });
  const [levelContent, setLevelContent] = useState({
    description: { high: "", medium: "", low: "" },
    location: { high: "", medium: "", low: "" }
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement smart contract interaction
    console.log("Creating event:", formData);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("活动创建成功！");
    }, 2000);
  };



  // Handle text selection
  const handleTextSelect = (field: "description" | "location") => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(prev => ({
        ...prev,
        [field]: selection.toString().trim()
      }));
    }
  };

  // Handle description content change
  const handleDescriptionChange = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const text = target.innerText;
    
    setFormData(prev => ({
      ...prev,
      description: text
    }));

    // Update high level content in display box
    setLevelContent(prev => ({
      ...prev,
      description: {
        ...prev.description,
        high: text
      }
    }));
  };

  // Set up MutationObserver to default new content to high level
  useEffect(() => {
    // Initialize and set up observer for description field
    if (descriptionRef.current) {
      // Initialize with current description
      if (formData.description) {
        descriptionRef.current.innerHTML = "";
        const span = document.createElement("span");
        span.style.backgroundColor = "#ffcccc"; // Light red for high level
        span.textContent = formData.description;
        descriptionRef.current.appendChild(span);
      }

      const descriptionObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              // Only wrap text nodes
              if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
                // Save cursor position
                const selection = window.getSelection();
                let range = null;
                if (selection && selection.rangeCount > 0) {
                  range = selection.getRangeAt(0);
                }

                const span = document.createElement("span");
                span.style.backgroundColor = "#ffcccc"; // Light red for high level
                span.textContent = node.textContent;
                node.parentNode?.replaceChild(span, node);

                // Restore cursor position
                if (range) {
                  // Create a new range and set it after the inserted span
                  const newRange = document.createRange();
                  newRange.setStartAfter(span);
                  newRange.collapse(true);
                  
                  // Clear existing selection and add the new range
                  if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                  }
                }
              }
            });
          }
        });
      });

      descriptionObserver.observe(descriptionRef.current, {
        childList: true,
        subtree: true
      });

      // Initialize and set up observer for location field
      if (locationRef.current) {
        // Initialize with current location
        if (formData.location) {
          locationRef.current.innerHTML = "";
          const span = document.createElement("span");
          span.style.backgroundColor = "#ffcccc"; // Light red for high level
          span.textContent = formData.location;
          locationRef.current.appendChild(span);
        }

        const locationObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              mutation.addedNodes.forEach((node) => {
                // Only wrap text nodes
                if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
                  // Save cursor position
                  const selection = window.getSelection();
                  let range = null;
                  if (selection && selection.rangeCount > 0) {
                    range = selection.getRangeAt(0);
                  }

                  const span = document.createElement("span");
                  span.style.backgroundColor = "#ffcccc"; // Light red for high level
                  span.textContent = node.textContent;
                  node.parentNode?.replaceChild(span, node);

                  // Restore cursor position
                  if (range) {
                    // Create a new range and set it after the inserted span
                    const newRange = document.createRange();
                    newRange.setStartAfter(span);
                    newRange.collapse(true);
                    
                    // Clear existing selection and add the new range
                    if (selection) {
                      selection.removeAllRanges();
                      selection.addRange(newRange);
                    }
                  }
                }
              });
            }
          });
        });

        locationObserver.observe(locationRef.current, {
          childList: true,
          subtree: true
        });

        return () => {
          descriptionObserver.disconnect();
          locationObserver.disconnect();
        };
      }

      return () => {
        descriptionObserver.disconnect();
      };
    }
  }, []);

  // Handle marking selected text with level
  const handleMarkText = (field: "description" | "location", level: "high" | "medium" | "low") => {
    if (!selectedText[field]) return;

    // Update level content
    setLevelContent(prev => {
      const newContent = {
        ...prev,
        [field]: {
          ...prev[field]
        }
      };

      // Update the selected level
      newContent[field][level] = selectedText[field];

      // Update medium level to include low level content
      // This logic applies to both description and location fields
      if (level === "low" || level === "medium") {
        // Get the low level content
        const lowContent = newContent[field].low || "";
        
        // If we're updating low level, update medium level to include it
        if (level === "low") {
          if (lowContent) {
            // If medium level has content, append low level content
            if (newContent[field].medium) {
              newContent[field].medium = `${newContent[field].medium}\n${lowContent}`;
            } else {
              newContent[field].medium = lowContent;
            }
          }
        }
        // If we're updating medium level, include low level content
        else if (level === "medium" && lowContent) {
          newContent[field].medium = `${selectedText[field]}\n${lowContent}`;
        }
      }

      return newContent;
    });

    // Apply background color to selected text
    if ((field === "description" && descriptionRef.current) || (field === "location" && locationRef.current)) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const span = document.createElement("span");
        
        // Set background color based on level
        const colorMap = {
          high: "#ffcccc", // Light red
          medium: "#ffffcc", // Light yellow
          low: "#cce5ff" // Light blue
        };
        
        span.style.backgroundColor = colorMap[level];
        span.textContent = selectedText[field];
        
        range.deleteContents();
        range.insertNode(span);
        
        // Update form data with the new innerText
        if (field === "description" && descriptionRef.current) {
          setFormData(prev => ({
            ...prev,
            description: descriptionRef.current?.innerText || ""
          }));
        } else if (field === "location" && locationRef.current) {
          setFormData(prev => ({
            ...prev,
            location: locationRef.current?.innerText || ""
          }));
        }
      }
    }

    // Clear selection after marking
    setSelectedText(prev => ({
      ...prev,
      [field]: ""
    }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
      </header>

      <div className={styles.content}>
        <div className={styles.formCard}>
          <h1 className={styles.title}>
            <span className={styles.icon}>➕</span>
            创建新活动
          </h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Event Title */}
            <div className={styles.formGroup}>
              <label htmlFor="title" className={styles.label}>
                活动标题 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="输入活动标题"
                required
                className={styles.input}
              />
            </div>

            {/* Event Description */}
            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                活动描述 <span className={styles.required}>*</span>
              </label>
              
              {/* Marker Navigation Bar */}
              <div className={styles.markerNav}>
                <button 
                  onClick={() => handleMarkText("description", "high")}
                  disabled={!selectedText.description}
                  className={styles.markerButton}
                >
                  高
                </button>
                <button 
                  onClick={() => handleMarkText("description", "medium")}
                  disabled={!selectedText.description}
                  className={styles.markerButton}
                >
                  中
                </button>
                <button 
                  onClick={() => handleMarkText("description", "low")}
                  disabled={!selectedText.description}
                  className={styles.markerButton}
                >
                  低
                </button>
              </div>
              
              <div
                ref={descriptionRef}
                id="description"
                name="description"
                contentEditable
                onInput={handleDescriptionChange}
                onMouseUp={() => handleTextSelect("description")}
                placeholder="详细描述您的活动..."
                required
                className={styles.editableDiv}
              ></div>
              
              {/* Display Boxes for Levels */}
              <div className={styles.levelDisplay}>
                <div className={styles.levelBox}>
                  <h4>高</h4>
                  <p>{levelContent.description.high || "无内容"}</p>
                </div>
                <div className={styles.levelBox}>
                  <h4>中</h4>
                  <p>{levelContent.description.medium || "无内容"}</p>
                </div>
                <div className={styles.levelBox}>
                  <h4>低</h4>
                  <p>{levelContent.description.low || "无内容"}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className={styles.formGroup}>
              <label htmlFor="location" className={styles.label}>
                活动地点 <span className={styles.required}>*</span>
              </label>
              
              {/* Marker Navigation Bar */}
              <div className={styles.markerNav}>
                <button 
                  onClick={() => handleMarkText("location", "high")}
                  disabled={!selectedText.location}
                  className={styles.markerButton}
                >
                  高
                </button>
                <button 
                  onClick={() => handleMarkText("location", "medium")}
                  disabled={!selectedText.location}
                  className={styles.markerButton}
                >
                  中
                </button>
                <button 
                  onClick={() => handleMarkText("location", "low")}
                  disabled={!selectedText.location}
                  className={styles.markerButton}
                >
                  低
                </button>
              </div>
              
              <div
                ref={locationRef}
                id="location"
                name="location"
                contentEditable
                onInput={(e) => {
                  const target = e.target as HTMLDivElement;
                  const text = target.innerText;
                  setFormData(prev => ({
                    ...prev,
                    location: text
                  }));

                  // Update high level content in display box
                  setLevelContent(prev => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      high: text
                    }
                  }));
                }}
                onMouseUp={() => handleTextSelect("location")}
                placeholder="输入活动地点"
                required
                className={styles.editableDiv}
              ></div>
              
              {/* Display Boxes for Levels */}
              <div className={styles.levelDisplay}>
                <div className={styles.levelBox}>
                  <h4>高</h4>
                  <p>{levelContent.location.high || "无内容"}</p>
                </div>
                <div className={styles.levelBox}>
                  <h4>中</h4>
                  <p>{levelContent.location.medium || "无内容"}</p>
                </div>
                <div className={styles.levelBox}>
                  <h4>低</h4>
                  <p>{levelContent.location.low || "无内容"}</p>
                </div>
              </div>
            </div>

            {/* Time Range */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="startTime" className={styles.label}>
                  开始时间 <span className={styles.required}>*</span>
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endTime" className={styles.label}>
                  结束时间 <span className={styles.required}>*</span>
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>
            </div>

            {/* Max Participants */}
            <div className={styles.formGroup}>
              <label htmlFor="maxParticipants" className={styles.label}>
                最大参与人数 <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="maxParticipants"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                placeholder="例如: 100"
                min="1"
                required
                className={styles.input}
              />
            </div>

            {/* Event Type */}
            <div className={styles.formGroup}>
              <label htmlFor="eventType" className={styles.label}>
                活动类型 <span className={styles.required}>*</span>
              </label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="public">公开活动</option>
                <option value="private">私密活动</option>
                <option value="invitation">仅限邀请</option>
              </select>
            </div>

            {/* Verification Toggle */}
            <div className={styles.formGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="requiresVerification"
                  checked={formData.requiresVerification}
                  onChange={handleChange}
                  className={styles.checkbox}
                />
                <span>需要身份验证</span>
              </label>
              <p className={styles.hint}>
                启用后,参与者需要通过匿名身份验证才能参加活动
              </p>
            </div>

            {/* Submit Button */}
            <div className={styles.buttonGroup}>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.submitButton} ${
                  isSubmitting ? styles.submitting : ""
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner}></span>
                    创建中...
                  </>
                ) : (
                  "创建活动"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>🔒 匿名保护</h3>
            <p>所有活动均采用零知识证明技术,保护参与者隐私</p>
          </div>
          <div className={styles.infoCard}>
            <h3>⛓️ 链上记录</h3>
            <p>活动数据存储在区块链上,确保透明和不可篡改</p>
          </div>
          <div className={styles.infoCard}>
            <h3>✅ 自动验证</h3>
            <p>智能合约自动验证参与资格,无需人工审核</p>
          </div>
        </div>
      </div>
    </div>
  );
}