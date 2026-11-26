const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let memoryDb = {
  users: [],
  programs: [],
  courses: [],
  enrolments: [],
  sessions: [],
  materials: [],
  assignments: [],
  submissions: [],
  attendance: [],
  announcements: [],
  contacts: [],
  reviews: []
};

// Load existing data from file if present
function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      memoryDb = { ...memoryDb, ...parsed };
    }
  } catch (err) {
    console.warn('[DB] Could not parse existing db.json, using fresh in-memory store:', err.message);
  }
}

// Persist data
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DB] Failed to persist db.json:', err.message);
  }
}

loadDatabase();

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// Generic Collection helper
class LocalCollection {
  constructor(name) {
    this.name = name;
    if (!memoryDb[this.name]) {
      memoryDb[this.name] = [];
    }
  }

  get items() {
    return memoryDb[this.name] || [];
  }

  async find(filter = {}) {
    let result = this.items.filter(item => {
      for (const [key, val] of Object.entries(filter)) {
        if (val !== undefined && item[key] !== val) return false;
      }
      return true;
    });
    // Return clone
    return JSON.parse(JSON.stringify(result));
  }

  async findOne(filter = {}) {
    const list = await this.find(filter);
    return list.length > 0 ? list[0] : null;
  }

  async findById(id) {
    const item = this.items.find(i => String(i._id) === String(id) || String(i.id) === String(id));
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async create(data) {
    const now = new Date().toISOString();
    const newItem = {
      _id: generateId(),
      ...data,
      createdAt: data.createdAt || now,
      updatedAt: now
    };
    this.items.push(newItem);
    saveDatabase();
    return JSON.parse(JSON.stringify(newItem));
  }

  async findByIdAndUpdate(id, updates, options = { new: true }) {
    const index = this.items.findIndex(i => String(i._id) === String(id) || String(i.id) === String(id));
    if (index === -1) return null;

    const updated = {
      ...this.items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.items[index] = updated;
    saveDatabase();
    return JSON.parse(JSON.stringify(updated));
  }

  async findByIdAndDelete(id) {
    const index = this.items.findIndex(i => String(i._id) === String(id) || String(i.id) === String(id));
    if (index === -1) return null;
    const [removed] = this.items.splice(index, 1);
    saveDatabase();
    return removed;
  }

  async deleteMany(filter = {}) {
    const beforeCount = this.items.length;
    memoryDb[this.name] = this.items.filter(item => {
      for (const [key, val] of Object.entries(filter)) {
        if (item[key] === val) return false;
      }
      return true;
    });
    saveDatabase();
    return { deletedCount: beforeCount - memoryDb[this.name].length };
  }

  async countDocuments(filter = {}) {
    const matches = await this.find(filter);
    return matches.length;
  }
}

module.exports = {
  db: memoryDb,
  getCollection: (name) => new LocalCollection(name),
  saveDatabase,
  loadDatabase
};
