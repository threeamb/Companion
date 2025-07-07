import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Alert,
    Checkbox,
    TextField,
    IconButton,
    Collapse,
    Tooltip,
    Snackbar,
    FormControlLabel,
} from '@mui/material';
import {
    Store,
    Schedule,
    CheckCircle,
    Info,
    AccessTime,
    ExpandLess,
    ExpandMore as ExpandMoreIcon,
    ContentCopy,
    NotificationsActive,
} from '@mui/icons-material';
import { addTaskNotification } from '../utils/notificationStore';

const StoreManDuty = () => {
    // Define checklist items with subtasks
    const checklistTemplate = [
        {
            id: 'opening-branch',
            task: 'Opening S4 Branch',
            description: 'Open S4 Branch, prepare devices and keypress books',
            dueTime: '08:00',
            required: true,
            category: 'Opening',
            subtasks: [
                {
                    id: 'unlock-doors',
                    task: 'Unlock S4 Branch doors',
                    instructions: 'Use the master key to unlock the office doors. Obtain the key from OPS Room. Ensure all office doors are locked when not in use.'
                },
                {
                    id: 'power-on-devices',
                    task: 'Power on devices',
                    instructions: 'Turn on I-Net Computer, Shredders, and Printers. Ensure all systems are booted up.'
                },
                {
                    id: 'check-keypress-books',
                    task: 'Prepare keypress books',
                    instructions: 'Retrieve keypress books from secure storage. Open the book to the current date. Count all keys in the keypress. Verify against the master key list. Report any discrepancies immediately.'
                },
            ]
        },
        {
            id: 'first-parade-check',
            task: 'First Parade State',
            description: 'Initial check and call missing members',
            dueTime: '09:00',
            required: true,
            category: 'Parade',
            subtasks: [
                {
                    id: 'check-attendance',
                    task: 'Check initial attendance',
                    instructions: 'Review the member statuses and mark present personnel. Note down members who do not have statuses and are not present.'
                },
                {
                    id: 'call-missing-am',
                    task: 'Contact missing personnel',
                    instructions: 'Call any personnel not present without statuses. Document attempts and responses. Escalate if no contact after 3 attempts.'
                },
                {
                    id: 'update-am-parade-state',
                    task: 'Send AM Parade State',
                    instructions: 'Enter current member presence into the parade state message. Include present, leave, course, and medical categories. Send AM parade state to relevant channels. Copy the previous parade state message for the format.'
                }
            ]
        },
        {
            id: 'midday-parade',
            task: 'Midday Parade State',
            description: 'Update and publish midday parade state',
            dueTime: '12:45',
            required: true,
            category: 'Parade',
            subtasks: [
                {
                    id: 'collect-updates',
                    task: 'Collect member updates',
                    instructions: 'Reference against updates from members. Record any changes since morning parade state.'
                },
                {
                    id: 'call-missing-pm',
                    task: 'Contact Medical Members without updates',
                    instructions: 'Contact members on RSO & AM MA if they are not present and do not have MC. Document attempts and responses. Escalate if no contact after 3 attempts.'
                },
                {
                    id: 'update-pm-parade-state',
                    task: 'Send PM Parade State',
                    instructions: 'Enter current member presence into the parade state message. Include present, leave, course, and medical categories. Send PM parade state to relevant channels.'
                }
            ]
        },
        {
            id: 'daily-reports',
            task: 'Complete End of Day Reports',
            description: 'Finalize all required End of Day documentation',
            dueTime: '17:45',
            required: true,
            category: 'Documentation',
            subtasks: [
                {
                    id: 'duty-log',
                    task: 'Send Duty Storeman reports',
                    instructions: 'Send the Security and Electrical Checklist, Cleanliness Check, and Next Day Duty Roster.'
                },
                {
                    id: 'security-checklist-superior-present',
                    task: 'Template for Security and Electrical Checklist if everyone is leaving office',
                    instructions: 'Copy the template below if everyone is leaving the office. Ask your superior if they are staying in the office or not.'
                },
                {
                    id: 'security-checklist-superior-absent',
                    task: 'Template for Security and Electrical Checklist if superior is staying in office',
                    instructions: 'Copy the template below if a superior is staying in the office. Ask your superior if they are staying in the office or not.'
                },
                {
                    id: 'cleanliness-check',
                    task: 'Template for Cleanliness Check',
                    instructions: 'Copy the template below for the Cleanliness Check.'
                },
                {
                    id: 'next-day-duty-roster',
                    task: 'Template for Next Day Duty Roster',
                    instructions: 'Copy the template below for the Next Day Duty Roster. Check against the Duty Roster outside S4 Branch.'
                }
            ]
        },
        {
            id: 'closing-branch',
            task: 'Closing S4 Branch',
            description: 'Turn off devices, secure premises, final checks',
            dueTime: '18:00',
            required: true,
            category: 'Closing',
            subtasks: [
                {
                    id: 'close-keypress-book',
                    task: 'Close the keypress book',
                    instructions: 'Sign off the keypress book for the day. Ensure all keys are accounted for. Close the book with a Last Entry.'
                },
                {
                    id: 'secure-documents',
                    task: 'Keep keypress book and documents secure',
                    instructions: 'Put the keypress book back to where you got it. Ensure all filing cabinets are locked and put away all Restricted documents in drawers.'
                },
                {
                    id: 'shutdown-equipment',
                    task: 'Shutdown all equipment',
                    instructions: 'Properly shut down computers, turn off printers and other devices. Ensure all plug switches are turned off.'
                },
                {
                    id: 'final-security-check',
                    task: 'Turn off all lights and Aircon, and secure premises',
                    instructions: 'Turn off all light switches and aircons. Ensure all windows and doors are locked if everyone is leaving the office.'
                },
                {
                    id: 'return-key',
                    task: 'Return Master Key',
                    instructions: 'Return the key to OPS room and go home!.'
                }
            ]
        }
    ];

    const [checklist, setChecklist] = useState([]);
    const [expandedTasks, setExpandedTasks] = useState({});
    const [expandedSubtasks, setExpandedSubtasks] = useState({});
    const [copySuccess, setCopySuccess] = useState(false);
    const [onDutyToday, setOnDutyToday] = useState(false);
    const [notificationPermission, setNotificationPermission] = useState('default');
    
    // Ref for autoscroll to completion section
    const completionSectionRef = useRef(null);

    // Get today's date string for localStorage key
    const getTodayKey = () => {
        const today = new Date();
        return `ds-checklist-${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    };

    // Check if it's a new day and reset if needed
    const checkAndResetDaily = () => {
        const today = getTodayKey();
        const lastSavedDate = localStorage.getItem('ds-checklist-date');

        if (lastSavedDate !== today) {
            // New day - reset checklist
            const resetChecklist = checklistTemplate.map(item => ({
                ...item,
                completed: false,
                completedAt: null,
                subtasks: item.subtasks ? item.subtasks.map(subtask => ({
                    ...subtask,
                    completed: false,
                    completedAt: null
                })) : []
            }));
            setChecklist(resetChecklist);
            localStorage.setItem('ds-checklist-date', today);
            localStorage.setItem(today, JSON.stringify(resetChecklist));
            localStorage.setItem('ds-subtask-completion', JSON.stringify({}));
        } else {
            // Same day - load existing data
            const savedChecklist = localStorage.getItem(today);
            const savedSubtasks = localStorage.getItem('ds-subtask-completion');

            if (savedChecklist) {
                try {
                    const parsedChecklist = JSON.parse(savedChecklist);
                    // Ensure subtasks are properly initialized for existing data
                    const normalizedChecklist = parsedChecklist.map(item => {
                        const templateItem = checklistTemplate.find(t => t.id === item.id);
                        return {
                            ...item,
                            subtasks: item.subtasks || (templateItem ? templateItem.subtasks.map(st => ({
                                ...st,
                                completed: false,
                                completedAt: null
                            })) : [])
                        };
                    });
                    setChecklist(normalizedChecklist);
                } catch (error) {
                    console.error('Error parsing saved checklist:', error);
                    // Fallback to initial checklist
                    const initialChecklist = checklistTemplate.map(item => ({
                        ...item,
                        completed: false,
                        completedAt: null,
                        subtasks: item.subtasks ? item.subtasks.map(subtask => ({
                            ...subtask,
                            completed: false,
                            completedAt: null
                        })) : []
                    }));
                    setChecklist(initialChecklist);
                }
            } else {
                const initialChecklist = checklistTemplate.map(item => ({
                    ...item,
                    completed: false,
                    completedAt: null,
                    subtasks: item.subtasks ? item.subtasks.map(subtask => ({
                        ...subtask,
                        completed: false,
                        completedAt: null
                    })) : []
                }));
                setChecklist(initialChecklist);
            }

            if (savedSubtasks) {
                try {
                    // Parse but don't use since we're not using this state anymore
                    JSON.parse(savedSubtasks);
                } catch (error) {
                    console.error('Error parsing saved subtasks:', error);
                }
            }
        }
    };

    // Initialize checklist on component mount
    useEffect(() => {
        checkAndResetDaily();

        // Check every minute for time updates
        const interval = setInterval(() => {
            checkAndResetDaily();
        }, 60000);

        return () => {
            clearInterval(interval);
            // Clear any scheduled notification timeouts
            const existingTimeouts = JSON.parse(localStorage.getItem('ds-notification-timeouts') || '[]');
            existingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Autoscroll to completion section when all tasks are completed
    useEffect(() => {
        const allTasksCompleted = checklist.length > 0 && checklist.every(item => item.completed);
        
        if (allTasksCompleted && completionSectionRef.current) {
            // Small delay to ensure the completion section is rendered
            setTimeout(() => {
                completionSectionRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 500);
        }
    }, [checklist]); // Watch for changes in checklist

    // Save checklist to localStorage
    const saveChecklist = (newChecklist) => {
        const today = getTodayKey();
        localStorage.setItem(today, JSON.stringify(newChecklist));
    };

    // Notification functions
    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            return permission;
        }
        return 'denied';
    };

    const sendNotification = useCallback((title, body, icon = '/logo192.png', taskInfo = null) => {
        // Add to notification store for the AppBar
        if (taskInfo) {
            addTaskNotification(title, {
                message: body,
                taskId: taskInfo.taskId,
                taskTitle: taskInfo.taskTitle,
                dueTime: taskInfo.dueTime,
                priority: taskInfo.priority || 'medium',
                type: taskInfo.type || 'task-due'
            });
        }

        // Send browser notification if permission granted
        if (notificationPermission === 'granted' && 'Notification' in window) {
            const notification = new Notification(title, {
                body,
                icon,
                badge: '/logo192.png',
                tag: 'ds-duty-reminder',
                requireInteraction: true,
                actions: [
                    { action: 'view', title: 'View Task' },
                    { action: 'dismiss', title: 'Dismiss' }
                ]
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // Auto-close after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10000);
        }
    }, [notificationPermission]);

    const scheduleNotifications = useCallback(() => {
        if (!onDutyToday || notificationPermission !== 'granted') return;

        // Clear existing timeouts
        const existingTimeouts = JSON.parse(localStorage.getItem('ds-notification-timeouts') || '[]');
        existingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));

        const newTimeouts = [];
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        checklist.forEach(item => {
            if (!item.completed && item.required) {
                const [dueHour, dueMinute] = item.dueTime.split(':').map(Number);
                const dueTimeMinutes = dueHour * 60 + dueMinute;
                const notificationTime = dueTimeMinutes - 30; // 30 minutes before
                const taskInfo = {
                    taskId: item.id,
                    taskTitle: item.task,
                    dueTime: item.dueTime,
                    priority: 'medium'
                };

                // Check if task is already overdue
                if (currentTime > dueTimeMinutes) {
                    // Task is overdue - send immediate notification
                    const minutesOverdue = currentTime - dueTimeMinutes;
                    sendNotification(
                        '🚨 Task Overdue!',
                        `"${item.task}" was due at ${item.dueTime} (${minutesOverdue} minutes ago). Please complete it as soon as possible.`,
                        '/logo192.png',
                        { ...taskInfo, priority: 'high', type: 'task-overdue' }
                    );
                }
                // Check if task is due within 30 minutes
                else if (currentTime >= notificationTime && currentTime <= dueTimeMinutes) {
                    // Task is due soon - send immediate notification
                    const minutesUntilDue = dueTimeMinutes - currentTime;
                    sendNotification(
                        '⏰ Task Due Soon!',
                        `"${item.task}" is due in ${minutesUntilDue} minutes (${item.dueTime}). Please start working on it.`,
                        '/logo192.png',
                        { ...taskInfo, priority: 'high', type: 'task-due' }
                    );
                }
                // Schedule future notification
                else if (notificationTime > currentTime) {
                    const timeUntilNotification = (notificationTime - currentTime) * 60 * 1000; // Convert to milliseconds

                    const timeoutId = setTimeout(() => {
                        sendNotification(
                            '⏰ DS Duty Reminder',
                            `"${item.task}" is due in 30 minutes (${item.dueTime}). Don't forget to complete it!`,
                            '/logo192.png',
                            { ...taskInfo, type: 'task-due' }
                        );
                    }, timeUntilNotification);

                    newTimeouts.push(timeoutId);
                }
            }
        });

        // Save timeout IDs to localStorage for cleanup
        localStorage.setItem('ds-notification-timeouts', JSON.stringify(newTimeouts));
    }, [onDutyToday, notificationPermission, checklist, sendNotification]);

    // Load duty status from localStorage
    useEffect(() => {
        const savedDutyStatus = localStorage.getItem('ds-on-duty-today');
        if (savedDutyStatus) {
            setOnDutyToday(JSON.parse(savedDutyStatus));
        }

        // Check notification permission
        if ('Notification' in window) {
            setNotificationPermission(Notification.permission);
        }
    }, []);

    // Schedule notifications when duty status or checklist changes
    useEffect(() => {
        if (onDutyToday && checklist.length > 0) {
            scheduleNotifications();
        }
    }, [onDutyToday, checklist, notificationPermission, scheduleNotifications]);

    // Handle duty checkbox change
    const handleDutyToggle = async (event) => {
        const isChecked = event.target.checked;
        
        if (isChecked && notificationPermission !== 'granted') {
            const permission = await requestNotificationPermission();
            if (permission !== 'granted') {
                alert('Please enable notifications to receive duty reminders. You can enable them in your browser settings.');
                return;
            }
        }

        setOnDutyToday(isChecked);
        localStorage.setItem('ds-on-duty-today', JSON.stringify(isChecked));

        if (isChecked && notificationPermission === 'granted') {
            // Add to notification store
            addTaskNotification('✅ Duty Status Updated', {
                message: 'You are now on duty today. You will receive reminders 30 minutes before tasks are due.',
                taskId: null,
                taskTitle: 'Duty Status',
                dueTime: null,
                priority: 'medium',
                type: 'duty-status'
            });
            
            // Send browser notification
            sendNotification(
                '✅ Duty Status Updated',
                'You are now on duty today. You will receive reminders 30 minutes before tasks are due.',
                '/logo192.png'
            );
        }
    };

    // Toggle subtask completion
    const toggleSubtask = (taskId, subtaskId) => {
        const newChecklist = checklist.map(item => {
            if (item.id === taskId) {
                // Ensure subtasks exists and is an array
                const subtasks = item.subtasks || [];
                const updatedSubtasks = subtasks.map(subtask => {
                    if (subtask.id === subtaskId) {
                        const completed = !subtask.completed;
                        return {
                            ...subtask,
                            completed,
                            completedAt: completed ? new Date().toLocaleTimeString() : null
                        };
                    }
                    return subtask;
                });

                // Check if all subtasks are completed to auto-complete parent
                const allSubtasksCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);
                const parentCompleted = allSubtasksCompleted && !item.completed;

                return {
                    ...item,
                    subtasks: updatedSubtasks,
                    completed: parentCompleted ? true : (allSubtasksCompleted ? item.completed : false),
                    completedAt: parentCompleted ? new Date().toLocaleTimeString() : item.completedAt
                };
            }
            return item;
        });

        setChecklist(newChecklist);
        saveChecklist(newChecklist);

        // Send completion notification if parent task was just completed
        const completedTask = newChecklist.find(item => item.id === taskId);
        if (completedTask && completedTask.completed && onDutyToday) {
            addTaskNotification('✅ Task Completed!', {
                message: `"${completedTask.task}" has been completed successfully.`,
                taskId: completedTask.id,
                taskTitle: completedTask.task,
                dueTime: completedTask.dueTime,
                priority: 'low',
                type: 'task-completed'
            });
        }

        // Auto-collapse parent task if all subtasks completed
        const task = newChecklist.find(item => item.id === taskId);
        if (task && task.completed && expandedTasks[taskId]) {
            setTimeout(() => {
                setExpandedTasks(prev => {
                    const newExpanded = { ...prev, [taskId]: false };

                    // Find the next incomplete task and auto-expand it
                    const currentTaskIndex = newChecklist.findIndex(item => item.id === taskId);
                    const nextTask = newChecklist.slice(currentTaskIndex + 1).find(item => !item.completed);

                    if (nextTask) {
                        newExpanded[nextTask.id] = true;
                    }

                    return newExpanded;
                });
            }, 1000); // Delay to show completion
        }
    };

    // Toggle task completion (this will complete/uncomplete all subtasks)
    const toggleTask = (taskId) => {
        const newChecklist = checklist.map(item => {
            if (item.id === taskId) {
                const completed = !item.completed;
                // Ensure subtasks exists and is an array
                const subtasks = item.subtasks || [];
                const updatedSubtasks = subtasks.map(subtask => ({
                    ...subtask,
                    completed,
                    completedAt: completed ? new Date().toLocaleTimeString() : null
                }));

                return {
                    ...item,
                    completed,
                    completedAt: completed ? new Date().toLocaleTimeString() : null,
                    subtasks: updatedSubtasks
                };
            }
            return item;
        });
        setChecklist(newChecklist);
        saveChecklist(newChecklist);

        // Send completion notification if task was just completed
        const taskForNotification = newChecklist.find(item => item.id === taskId);
        if (taskForNotification && taskForNotification.completed && onDutyToday) {
            addTaskNotification('✅ Task Completed!', {
                message: `"${taskForNotification.task}" has been completed successfully.`,
                taskId: taskForNotification.id,
                taskTitle: taskForNotification.task,
                dueTime: taskForNotification.dueTime,
                priority: 'low',
                type: 'task-completed'
            });
        }

        // Auto-collapse and open next task if this task was completed
        const completedTask = newChecklist.find(item => item.id === taskId);
        if (completedTask && completedTask.completed && expandedTasks[taskId]) {
            setTimeout(() => {
                setExpandedTasks(prev => {
                    const newExpanded = { ...prev, [taskId]: false };

                    // Find the next incomplete task and auto-expand it
                    const currentTaskIndex = newChecklist.findIndex(item => item.id === taskId);
                    const nextTask = newChecklist.slice(currentTaskIndex + 1).find(item => !item.completed);

                    if (nextTask) {
                        newExpanded[nextTask.id] = true;
                    }

                    return newExpanded;
                });
            }, 1000); // Delay to show completion
        }
    };

    // Toggle task expansion
    const toggleTaskExpansion = (taskId) => {
        setExpandedTasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    // Toggle subtask instructions
    const toggleSubtaskInstructions = (subtaskId) => {
        setExpandedSubtasks(prev => ({
            ...prev,
            [subtaskId]: !prev[subtaskId]
        }));
    };

    // Check if task is overdue
    const isOverdue = (item) => {
        if (item.completed || !item.required) return false;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [dueHour, dueMinute] = item.dueTime.split(':').map(Number);
        const dueTimeMinutes = dueHour * 60 + dueMinute;

        return currentTime > dueTimeMinutes;
    };

    // Get task status color
    const getTaskColor = (item) => {
        if (item.completed) return 'success.main';
        if (isOverdue(item)) return 'error.main';
        return 'text.primary';
    };

    // Get background color for task
    const getTaskBackground = (item) => {
        if (item.completed) return 'rgba(76, 175, 80, 0.1)';
        if (isOverdue(item)) return 'rgba(244, 67, 54, 0.1)';
        return 'transparent';
    };

    // Copy text to clipboard function
    const handleCopyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Modern fallback for older browsers that still support it
            try {
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                if (successful) {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                } else {
                    throw new Error('Copy command failed');
                }
            } catch (fallbackErr) {
                console.error('Fallback copy failed: ', fallbackErr);
                // You could show an error message to user here
                alert('Copy failed. Please copy the text manually.');
            }
        }
    };

    // Template texts for copy-paste functionality
    // TO ADD A NEW TEMPLATE:
    // 1. Add your subtask ID as a key in the templates object below
    // 2. Provide the template text as a string (use backticks for multiline)
    // 3. Use [BRACKETS] for placeholder values that users should replace
    // 4. Configure the subtask in getSubtaskConfig() function below
    const getTemplateText = (subtaskId) => {
        const templates = {
            'update-am-parade-state': `Date: [DD/MM/YYYY] (AM)

Strength: [XX/XX]

1. [RANK] [NAME] - [STATUS] (e.g. P, MC, OC, WFH, OFF, etc.)
2. [RANK] [NAME] - [STATUS] (e.g. P, MC, OC, WFH, OFF, etc.)
3. [RANK] [NAME] - [STATUS] (e.g. P, MC, OC, WFH, OFF, etc.)
...
`,
            'update-pm-parade-state': `Date: [DD/MM/YYYY] (PM)

Strength: [XX/XX]

1. [RANK] [NAME] - [STATUS] (e.g. P, MC, OC, WFH, OFF, etc.)
2. [RANK] [NAME] - [STATUS] (e.g. P, MC, OC, WFH, OFF, etc.)
3. [RANK] [NAME] - [STATUS] (e.g. P, MC, OC, WFH, OFF, etc.)
...
`,
            'security-checklist-superior-present': `Security and Electrical Checklist (020725)

 1. No Classified documents left unattended or unsecured (Kept in the locked cabinet)✅

2. No official storage devices (Flashguard etc.) And ISAC left unattended or unsecured. ✅

3. No Doors, Windows, Grey Cabinets left unlocked ✅

4. No Personal devices Plugged in (Chargers,Power Banks etc.) ✅

5. All Applicances Turn Off (Aircon,  Shredder, Lights and Air Purifiers) ✅`
            ,
            'security-checklist-superior-absent': `Security and Electrical Checklist (030725)

 1. No Classified documents left unattended or unsecured (Kept in the locked cabinet)✅

2. No official storage devices (Flashguard etc.) And ISAC left unattended or unsecured. ✅

3. No Doors, Windows, Grey Cabinets left unlocked ❌

4. No Personal devices Plugged in (Chargers,Power Banks etc.) ✅

5. All Applicances Turn Off (Aircon,  Shredder, Lights and Air Purifiers) ❌`
            ,
            'cleanliness-check': `Changing Room Cleaniness ✅`
            ,
            'next-day-duty-roster': `DUTY STOREMAN [DDMMYY]
ACTUAL : [RANK] [NAME]
STANDBY: [RANK] [NAME]`
            // Add more templates here as needed
            // 'your-subtask-id': `Your template content here...`
        };
        return templates[subtaskId] || '';
    };

    // Configuration for subtask enhancements (templates, tips, etc.)
    // HOW TO ADD TEMPLATES AND TIPS TO SUBTASKS:
    // 1. Add your subtask ID as a key in the configs object below
    // 2. Set hasTemplate: true if you want a copy-paste template
    // 3. Add your template text in the getTemplateText function above
    // 4. Set templateRows to control the height of the template box
    // 5. Add tipMessage for helpful user guidance
    // 6. For tip-only (no template): set hasTemplate: false and just add tipMessage
    //
    // Example:
    // 'your-subtask-id': {
    //   hasTemplate: true,                    // Show template box with copy button
    //   templateRows: 6,                      // Height of template textarea
    //   tipMessage: 'Your helpful tip here'   // User guidance message
    // }
    const getSubtaskConfig = (subtaskId) => {
        const configs = {
            'update-am-parade-state': {
                hasTemplate: true,
                templateRows: 8,
                tipMessage: 'Click the copy button above to copy the template, then paste it and formulate your message. Replace [brackets] with actual information. It is suggested to copy the previous parade state message for its template.'
            },
            'update-pm-parade-state': {
                hasTemplate: true,
                templateRows: 8,
                tipMessage: 'Click the copy button above to copy the template, then paste it and formulate your message. Replace [brackets] with actual information. It is suggested to copy the previous parade state message for its template.'
            },
            'close-keypress-book': {
                hasTemplate: false,
                templateRows: 0,
                tipMessage: 'Refer to the day before\'s keypress book for the format.'
            },
            'security-checklist-superior-present': {
                hasTemplate: true,
                templateRows: 8,
                tipMessage: 'Click the copy button above to copy the template, then paste it into relevant channels.'
            },
            'security-checklist-superior-absent': {
                hasTemplate: true,
                templateRows: 8,
                tipMessage: 'Click the copy button above to copy the template, then paste it into relevant channels.'
            },
            'cleanliness-check': {
                hasTemplate: true,
                templateRows: 1,
                tipMessage: 'Click the copy button above to copy the template, then paste it into relevant channels.'
            },
            'next-day-duty-roster': {
                hasTemplate: true,
                templateRows: 3,
                tipMessage: 'Click the copy button above to copy the template, then paste it into relevant channels.'
            },
            // Add more subtask configurations here as needed
            // Example for tip-only (no template):
            // 'call-missing-am': {
            //   hasTemplate: false, 
            //   tipMessage: 'Always document call attempts with timestamps and outcomes. If no answer after 3 attempts, escalate to your supervisor immediately.'
            // }
        };
        return configs[subtaskId] || { hasTemplate: false };
    };

    return (
        <Container maxWidth="lg" sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Duty Storeman (DS) Guide
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Complete responsibilities and procedures for the role of Duty Storeman in 3AMB HQ.
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip label="Duty" size="small" />
                    <Chip label="Responsibilities" size="small" />
                    <Chip label="Procedures" size="small" />
                    <Chip label="Checklist" size="small" />
                </Stack>
            </Box>

            {/* Overview */}
            <Card elevation={2} sx={{ mb: 4, width: '100%' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Store sx={{ mr: 1 }} />
                        Overview
                    </Typography>
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                        This guide outlines the key responsibilities, tasks, and procedures for employees on DS duty
                        in 3AMB S4 Branch. Follow this guide to complete your duty diligently and efficiently!
                    </Typography>
                </CardContent>
            </Card>

            {/* Daily Responsibilities */}
            <Card elevation={2} sx={{ mb: 4, width: '100%' }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Schedule sx={{ mr: 1 }} />
                        DS Responsibilities
                    </Typography>
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Opening S4 Branch"
                                secondary="Open S4 Branch, prepare devices and keypress books"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Track Parade State"
                                secondary="Track parade state, call missing members, publish parade state"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Keypress Management"
                                secondary="Sign in and out keys, manage keypress books, ensure all keys are accounted for"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                <CheckCircle color="success" />
                            </ListItemIcon>
                            <ListItemText
                                primary="Closing S4 Branch"
                                secondary="Complete daily reports, turn off devices, secure premises"
                            />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>

            {/* DS Checklist */}
            <Card elevation={2} sx={{ mb: 4, width: '100%' }} id="ds-checklist">
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <CheckCircle sx={{ mr: 1 }} />
                        DS Checklist
                        <Chip
                            label={`${checklist.filter(item => item.completed).length}/${checklist.length} Complete`}
                            size="small"
                            color="primary"
                            sx={{ ml: 2 }}
                        />
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Track your Duty tasks. Checklist resets at midnight. Red items are overdue.
                    </Typography>

                    {/* Duty Status Checkbox */}
                    <Box sx={{ mb: 3, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={onDutyToday}
                                    onChange={handleDutyToggle}
                                    color="primary"
                                    size="small"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <NotificationsActive sx={{ fontSize: 16, color: onDutyToday ? 'primary.main' : 'text.secondary' }} />
                                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                        I am on duty today - Send me notification reminders
                                    </Typography>
                                    {onDutyToday && notificationPermission === 'granted' && (
                                        <Chip 
                                            label="Active" 
                                            size="small" 
                                            color="success" 
                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                        />
                                    )}
                                    {onDutyToday && notificationPermission !== 'granted' && (
                                        <Chip 
                                            label="Permission Required" 
                                            size="small" 
                                            color="warning" 
                                            sx={{ height: 20, fontSize: '0.7rem' }}
                                        />
                                    )}
                                </Box>
                            }
                            sx={{ m: 0 }}
                        />                    {onDutyToday && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, ml: 3.5 }}>
                            You'll receive notifications 30 minutes before each task is due. 
                            Notifications are also stored in the 🔔 icon in the top-right corner - click them to jump to specific tasks!
                        </Typography>
                    )}
                    </Box>

                    <List sx={{ p: 0 }}>
                        {checklist.map((item, index) => {
                            const isTaskOverdue = isOverdue(item);
                            const completedSubtasks = item.subtasks?.filter(st => st.completed).length || 0;
                            const totalSubtasks = item.subtasks?.length || 0;

                            return (
                                <Box key={item.id}>
                                    {/* Main Task */}
                                    <ListItem
                                        id={item.id}
                                        sx={{
                                            border: 1,
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            mb: 1,
                                            backgroundColor: getTaskBackground(item),
                                            opacity: item.completed ? 0.8 : 1,
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        <Checkbox
                                            checked={item.completed}
                                            onChange={() => toggleTask(item.id)}
                                            color={isTaskOverdue ? 'error' : 'primary'}
                                            sx={{
                                                color: getTaskColor(item),
                                                '&.Mui-checked': {
                                                    color: getTaskColor(item),
                                                },
                                            }}
                                        />
                                        <ListItemIcon sx={{ minWidth: 40 }}>
                                            {item.completed ? (
                                                <CheckCircle
                                                    sx={{
                                                        color: getTaskColor(item),
                                                        fontSize: '1.2rem'
                                                    }}
                                                />
                                            ) : (
                                                <AccessTime
                                                    sx={{
                                                        color: getTaskColor(item),
                                                        fontSize: '1.2rem'
                                                    }}
                                                />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            color: getTaskColor(item),
                                                            textDecoration: item.completed ? 'line-through' : 'none',
                                                            fontWeight: item.required ? 'medium' : 'normal'
                                                        }}
                                                    >
                                                        {item.task}
                                                    </Typography>
                                                    <Chip
                                                        label={item.dueTime}
                                                        size="small"
                                                        variant="outlined"
                                                        color={isTaskOverdue ? 'error' : 'default'}
                                                        sx={{ fontSize: '0.7rem', height: 20 }}
                                                    />
                                                    {item.required && (
                                                        <Chip
                                                            label="Required"
                                                            size="small"
                                                            color="warning"
                                                            sx={{ fontSize: '0.65rem', height: 18 }}
                                                        />
                                                    )}
                                                    <Chip
                                                        label={`${completedSubtasks}/${totalSubtasks} Steps`}
                                                        size="small"
                                                        color={completedSubtasks === totalSubtasks ? 'success' : 'default'}
                                                        sx={{ fontSize: '0.65rem', height: 18 }}
                                                    />
                                                    {item.completed && (
                                                        <Chip
                                                            label={`✓ ${item.completedAt}`}
                                                            size="small"
                                                            color="success"
                                                            sx={{ fontSize: '0.65rem', height: 18 }}
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: item.completed ? 'text.disabled' : 'text.secondary',
                                                        mt: 0.5
                                                    }}
                                                >
                                                    {item.description}
                                                </Typography>
                                            }
                                        />
                                        <IconButton
                                            onClick={() => toggleTaskExpansion(item.id)}
                                            size="small"
                                            sx={{ ml: 1 }}
                                        >
                                            {expandedTasks[item.id] ? <ExpandLess /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </ListItem>

                                    {/* Subtasks */}
                                    <Collapse in={expandedTasks[item.id]} timeout="auto" unmountOnExit>
                                        <Box sx={{ ml: 4, mr: 1, mb: 2 }}>
                                            <List sx={{ py: 0 }}>
                                                {item.subtasks?.map((subtask, subtaskIndex) => (
                                                    <Box key={subtask.id}>
                                                        <ListItem
                                                            sx={{
                                                                border: '1px solid',
                                                                borderColor: 'divider',
                                                                borderRadius: 1,
                                                                mb: 1,
                                                                backgroundColor: subtask.completed ? 'rgba(76, 175, 80, 0.05)' : 'background.paper',
                                                                opacity: subtask.completed ? 0.7 : 1,
                                                                pl: 1,
                                                            }}
                                                        >
                                                            <Checkbox
                                                                checked={subtask.completed}
                                                                onChange={() => toggleSubtask(item.id, subtask.id)}
                                                                size="small"
                                                                color="primary"
                                                                sx={{
                                                                    '&.Mui-checked': {
                                                                        color: 'success.main',
                                                                    },
                                                                }}
                                                            />
                                                            <ListItemText
                                                                primary={
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            textDecoration: subtask.completed ? 'line-through' : 'none',
                                                                            color: subtask.completed ? 'text.disabled' : 'text.primary',
                                                                            fontWeight: 'medium'
                                                                        }}
                                                                    >
                                                                        {subtask.task}
                                                                        {subtask.completed && (
                                                                            <Chip
                                                                                label={`✓ ${subtask.completedAt}`}
                                                                                size="small"
                                                                                color="success"
                                                                                sx={{
                                                                                    fontSize: '0.6rem',
                                                                                    height: 16,
                                                                                    ml: 1
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </Typography>
                                                                }
                                                            />
                                                            <IconButton
                                                                onClick={() => toggleSubtaskInstructions(subtask.id)}
                                                                size="small"
                                                                sx={{
                                                                    color: expandedSubtasks[subtask.id] ? 'primary.main' : 'text.secondary'
                                                                }}
                                                            >
                                                                <Info fontSize="small" />
                                                            </IconButton>
                                                        </ListItem>

                                                        {/* Subtask Instructions */}
                                                        <Collapse in={expandedSubtasks[subtask.id]} timeout="auto" unmountOnExit>
                                                            <Box sx={{ ml: 3, mr: 1, mb: 1 }}>
                                                                <Card
                                                                    variant="outlined"
                                                                    sx={{
                                                                        p: 2,
                                                                        width: '100%',
                                                                        backgroundColor: 'background.paper',
                                                                        borderColor: 'primary.main',
                                                                        borderWidth: 2,
                                                                    }}
                                                                >
                                                                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                                                        INSTRUCTIONS:
                                                                    </Typography>
                                                                    <Typography variant="body2" sx={{ mt: 0.5, color: 'text.primary', lineHeight: 1.6 }}>
                                                                        {subtask.instructions}
                                                                    </Typography>

                                                                    {/* Dynamic Template and Tip System */}
                                                                    {(() => {
                                                                        const config = getSubtaskConfig(subtask.id);

                                                                        return (
                                                                            <>
                                                                                {/* Template Section */}
                                                                                {config.hasTemplate && (
                                                                                    <Box sx={{ mt: 2 }}>
                                                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                                                            <Typography variant="caption" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                                                                                                TEMPLATE:
                                                                                            </Typography>
                                                                                            <Tooltip title="Copy template">
                                                                                                <IconButton
                                                                                                    size="small"
                                                                                                    onClick={() => handleCopyText(getTemplateText(subtask.id))}
                                                                                                    sx={{ ml: 1 }}
                                                                                                >
                                                                                                    <ContentCopy fontSize="small" />
                                                                                                </IconButton>
                                                                                            </Tooltip>
                                                                                        </Box>
                                                                                        <TextField
                                                                                            multiline
                                                                                            rows={config.templateRows || 8}
                                                                                            fullWidth
                                                                                            value={getTemplateText(subtask.id)}
                                                                                            variant="outlined"
                                                                                            InputProps={{
                                                                                                readOnly: true,
                                                                                                sx: {
                                                                                                    fontFamily: 'monospace',
                                                                                                    fontSize: '0.8rem',
                                                                                                    backgroundColor: 'grey.50',
                                                                                                }
                                                                                            }}
                                                                                            sx={{
                                                                                                '& .MuiOutlinedInput-root': {
                                                                                                    '& fieldset': {
                                                                                                        borderColor: 'secondary.main',
                                                                                                    },
                                                                                                },
                                                                                            }}
                                                                                        />
                                                                                    </Box>
                                                                                )}

                                                                                {/* Tip Section */}
                                                                                {config.tipMessage && (
                                                                                    <Alert severity="success" sx={{ mt: 2, fontSize: '0.8rem' }}>
                                                                                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                                                                            <strong>💡 Tip:</strong> {config.tipMessage}
                                                                                        </Typography>
                                                                                    </Alert>
                                                                                )}
                                                                            </>
                                                                        );
                                                                    })()}
                                                                </Card>
                                                            </Box>
                                                        </Collapse>
                                                    </Box>
                                                ))}
                                            </List>
                                        </Box>
                                    </Collapse>
                                </Box>
                            );
                        })}
                    </List>

                    <Alert severity="info" sx={{ mt: 2 }}>
                        <Typography variant="body2">
                            <strong>How to use:</strong> Click the expand arrow to see detailed steps for each task.
                            Click the info (i) icon next to each step for instructions. Parent tasks auto-complete when all steps are done.
                        </Typography>
                    </Alert>
                </CardContent>
            </Card>

            {/* Final Completion Reminder - Only shows when all tasks are complete */}
            {checklist.length > 0 && checklist.every(item => item.completed) && (
                <Card 
                    ref={completionSectionRef}
                    elevation={3} 
                    sx={{ 
                        mb: 4, 
                        width: '100%',
                        border: '2px solid',
                        borderColor: 'success.main',
                        backgroundColor: 'rgba(76, 175, 80, 0.05)',
                        '@keyframes pulse': {
                            '0%': {
                                boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)',
                            },
                            '70%': {
                                boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
                            },
                            '100%': {
                                boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
                            },
                        },
                        animation: 'pulse 2s infinite'
                    }}
                >
                    <CardContent>
                        <Typography 
                            variant="h5" 
                            gutterBottom 
                            sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                color: 'success.main',
                                fontWeight: 'bold'
                            }}
                        >
                            <CheckCircle sx={{ mr: 1, fontSize: '2rem' }} />
                            🎉 All Tasks Completed! 🎉
                        </Typography>
                        
                        <Typography variant="h6" sx={{ mb: 2, color: 'success.dark' }}>
                            Excellent work! Before you finish your duty, please complete this final checks:
                        </Typography>

                        <List sx={{ backgroundColor: 'background.paper', borderRadius: 1, p: 2 }}>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Double-check all keys are returned to keypress"
                                    secondary="Ensure no keys are missing and the keypress book is completed"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Verify all reports have been sent"
                                    secondary="Security checklist, cleanliness check, and next day duty roster"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Ensure all devices are powered down"
                                    secondary="Lights, Aircon, and All Plugged Devices"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <CheckCircle color="success" />
                                </ListItemIcon>
                                <ListItemText 
                                    primary="Ensure Master key is returned"
                                    secondary="Ensure the key is returned to the Operations Room. Dont bring it home!"
                                />
                            </ListItem>
                        </List>

                        <Alert severity="success" sx={{ mt: 2 }}>
                            <Typography variant="body2">
                                <strong>🏆 Outstanding Job!</strong> You have successfully completed all your Duty Storeman responsibilities. 
                                Your diligence helps maintain the security and efficiency of 3AMB S4 Branch. Have a safe journey home!
                            </Typography>
                        </Alert>
                    </CardContent>
                </Card>
            )}

            {/* Important Notes */}
            <Alert severity="info" sx={{ mb: 4 }}>
                <Typography variant="body2">
                    <strong>Tip:</strong> Learn where all the switches are. You are responsible for the branch's closing.
                </Typography>
            </Alert>

            {/* Copy Success Snackbar */}
            <Snackbar
                open={copySuccess}
                autoHideDuration={2000}
                onClose={() => setCopySuccess(false)}
                message="Template copied to clipboard!"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />

        </Container>
    );
};

// Export with metadata for dynamic loading
export const storeManDutyMetadata = {
    id: 'store-manager-duty',
    title: 'Duty Storeman Guide',
    description: 'Complete responsibilities and procedures for Duty Storeman (DS) in the 3AMB',
    tags: ['s4 branch', 'duty', 'procedures', 'opening', 'closing', 'keypress', 'ds', 'checklist'],
    category: 'Operations',
    lastUpdated: 'July 2025',
    estimatedReadTime: '10 min'
};

export default StoreManDuty;
