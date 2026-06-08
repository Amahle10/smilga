const BASE_URL = 'http://localhost:3000';
const MESSAGES_URL = 'http://localhost:3000/messages';

// --- ROOT HEALTH CHECK (GET /) ---
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
            listContainer.innerHTML = ''; 

            if (data.length === 0) {
                listContainer.innerHTML = '<p>No records found in database.</p>';
                return;
            }

            data.forEach(item => {
                const rowDiv = document.createElement('div');
                rowDiv.className = 'row-item';
                rowDiv.innerHTML = `
                    <span><strong>ID ${item.id}:</strong> ${item.text_content}</span>
                    <div>
                        <button class="btn-edit" onclick="inlineEditPrompt(${item.id}, '${item.text_content}')">Edit</button>
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

    if (!textToSend) return alert('Please enter text content.');

    fetch(MESSAGES_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text_content: textToSend })
    })
    .then(res => res.json())
    .then(() => {
        inputElement.value = ''; 
        readMessages(); 
    })
    .catch(err => console.error('Error adding record:', err));
}

// --- 3. DELETE SPECIFIC ROW BY ID INPUT ---
function deleteMessageByIdInput() {
    const idInput = document.getElementById('delete-id-input');
    const id = idInput.value.trim();

    if (!id) return alert('Please enter a target ID.');
    if (!confirm(`Delete row ID ${id}?`)) return;

    fetch(`${MESSAGES_URL}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            idInput.value = ''; 
            readMessages(); 
        })
        .catch(err => console.error(err));
}

// --- 4. EDIT SPECIFIC ROW BY ID INPUT ---
function editMessageByIdInput() {
    const idInput = document.getElementById('edit-id-input');
    const contentInput = document.getElementById('edit-content-input');
    const id = idInput.value.trim();
    const updatedText = contentInput.value.trim();

    if (!id || !updatedText) return alert('Please provide both the ID and new text content.');

    fetch(`${MESSAGES_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text_content: updatedText })
    })
    .then(res => res.json())
    .then(() => {
        idInput.value = '';
        contentInput.value = '';
        readMessages();
    })
    .catch(err => console.error(err));
}

// --- NEW: 5. WIPE ENTIRE DATABASE (DELETE /messages) ---
function deleteAllMessages() {
    const doubleCheck = confirm('WARNING: Are you sure you want to delete ALL rows? This will reset your table entirely.');
    if (!doubleCheck) return;

    fetch(MESSAGES_URL, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        readMessages(); 
    })
    .catch(err => console.error('Error clearing database:', err));
}

// --- INLINE LIST INTERACTION HELPERS ---
function inlineEditPrompt(id, oldText) {
    const updatedText = prompt('Update your message text:', oldText);
    if (!updatedText || updatedText.trim() === '') return;

    fetch(`${MESSAGES_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text_content: updatedText.trim() })
    })
    .then(res => res.json())
    .then(() => readMessages())
    .catch(err => console.error(err));
}

function deleteMessage(id) {
    if (!confirm(`Delete item ID ${id}?`)) return;
    fetch(`${MESSAGES_URL}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => readMessages())
        .catch(err => console.error(err));
}

// Automatically populate the list view on window boot
window.onload = () => {
    readMessages();
};
