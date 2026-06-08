const BASE_URL = 'http://localhost:3000';
const MESSAGES_URL = 'http://localhost:3000/messages';

// --- 0. ROOT HEALTH CHECK (GET /) ---
function checkServerHealth() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(data => {
            document.getElementById('health-status').textContent = `Response: ${data.message}`;
        })
        .catch(err => {
            console.error(err);
            document.getElementById('health-status').textContent = 'Server offline or unreachable.';
        });
}

// --- 1. READ ALL RECORDS (GET /messages) ---
function readMessages() {
    fetch(MESSAGES_URL)
        .then(res => res.json())
        .then(data => {
            const listContainer = document.getElementById('database-list');
            listContainer.innerHTML = ''; // Clear prior elements

            if (data.length === 0) {
                listContainer.innerHTML = '<p>No records found in database.</p>';
                return;
            }

            // Loop records and construct DOM nodes dynamically
            data.forEach(item => {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'row-item';

                rowDiv.innerHTML = `
                    <span><strong>ID ${item.id}:</strong> ${item.text_content}</span>
                    <div>
                        <button class="btn-edit" onclick="editMessagePrompt(${item.id}, '${item.text_content}')">Edit</button>
                        <button class="btn-delete" onclick="deleteMessage(${item.id})">Delete</button>
                    </div>
                `;
                listContainer.appendChild(rowDiv);
            });
        })
        .catch(err => console.error('Error fetching data:', err));
}

// --- 2. CREATE RECORD (POST /messages) ---
function createMessage() {
    const inputElement = document.getElementById('new-message-input');
    const textToSend = inputElement.value.trim();

    if (!textToSend) {
        alert('Please enter text content before submitting.');
        return;
    }

    fetch(MESSAGES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text_content: textToSend })
    })
    .then(res => res.json())
    .then(() => {
        inputElement.value = ''; // Reset input field
        readMessages();          // Refresh DOM view automatically
    })
    .catch(err => console.error('Error adding record:', err));
}

// --- 3. EDIT/UPDATE RECORD (PUT /messages/:id) ---
function editMessagePrompt(id, oldText) {
    const updatedText = prompt('Update your message text content:', oldText);
    
    if (updatedText === null || updatedText.trim() === '') return;

    fetch(`${MESSAGES_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text_content: updatedText.trim() })
    })
    .then(res => res.json())
    .then(() => readMessages())
    .catch(err => console.error('Error modifying record:', err));
}

// --- 4. DELETE RECORD (DELETE /messages/:id) ---
function deleteMessage(id) {
    if (!confirm(`Are you sure you want to delete row ID ${id}?`)) return;

    fetch(`${MESSAGES_URL}/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(() => readMessages())
    .catch(err => console.error('Error removing record:', err));
}

// Automatically load existing records when web page first boots up
window.onload = () => {
    readMessages();
};
