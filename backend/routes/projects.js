const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const PROJECTS_DIR = path.join(__dirname, '..', 'projects');
const USERS_DIR = path.join(__dirname, '..', 'users');

[PROJECTS_DIR, USERS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const getProjectFilePath = (userId) => path.join(PROJECTS_DIR, `${userId}.json`);
const getUserProjectsDir = (userId) => path.join(USERS_DIR, userId);
const getProjectDir = (userId, projectName) => path.join(getUserProjectsDir(userId), projectName);

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const saveFilesToDir = async (nodes, baseDir) => {
  for (const node of nodes) {
    if (node.type === 'file') {
      const filePath = path.join(baseDir, node.path);
      ensureDir(path.dirname(filePath));
      await fs.promises.writeFile(filePath, node.content || '', 'utf8');
    } else if (node.children) {
      await saveFilesToDir(node.children, baseDir);
    }
  }
};

const loadFilesFromDir = async (baseDir) => {
  const nodes = [];
  
  const scanDir = async (currentDir, parentPath) => {
    const items = await fs.promises.readdir(currentDir, { withFileTypes: true });
    
    for (const item of items) {
      const itemPath = path.join(currentDir, item.name);
      const relativePath = parentPath ? `${parentPath}/${item.name}` : item.name;
      
      if (item.isDirectory()) {
        const folderNode = {
          name: item.name,
          path: relativePath,
          type: 'folder',
          children: []
        };
        nodes.push(folderNode);
        await scanDir(itemPath, relativePath);
      } else {
        const content = await fs.promises.readFile(itemPath, 'utf8');
        nodes.push({
          name: item.name,
          path: relativePath,
          type: 'file',
          content
        });
      }
    }
  };
  
  await scanDir(baseDir, '');
  return nodes;
};

const buildTreeFromFlatList = (nodes) => {
  const map = new Map();
  const roots = [];
  
  for (const node of nodes) {
    map.set(node.path, { ...node, children: node.children || [] });
  }
  
  for (const [path, node] of map) {
    const parts = path.split('/');
    if (parts.length === 1) {
      roots.push(node);
    } else {
      const parentPath = parts.slice(0, -1).join('/');
      const parent = map.get(parentPath);
      if (parent) {
        parent.children.push(node);
      }
    }
  }
  
  return roots;
};

router.post('/save', async (req, res) => {
  try {
    const { projectName, files } = req.body;
    const { userId } = req.user;

    if (!projectName || !files) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const userProjectsDir = getUserProjectsDir(userId);
    const projectDir = getProjectDir(userId, projectName);
    
    ensureDir(userProjectsDir);
    
    if (fs.existsSync(projectDir)) {
      await fs.promises.rm(projectDir, { recursive: true, force: true });
    }
    
    await saveFilesToDir(files, projectDir);

    let projects = {};
    try {
      const content = await fs.promises.readFile(getProjectFilePath(userId), 'utf8');
      projects = JSON.parse(content);
    } catch {
      projects = {};
    }

    projects[projectName] = {
      files,
      updatedAt: new Date().toISOString(),
      path: projectDir
    };

    await fs.promises.writeFile(getProjectFilePath(userId), JSON.stringify(projects, null, 2));

    res.json({ message: '项目保存成功', path: projectDir });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const { userId } = req.user;

    let projects = {};
    try {
      const content = await fs.promises.readFile(getProjectFilePath(userId), 'utf8');
      projects = JSON.parse(content);
    } catch {
      projects = {};
    }

    const projectList = Object.entries(projects).map(([name, data]) => ({
      name,
      updatedAt: data.updatedAt,
      path: data.path
    }));

    res.json({ projects: projectList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:projectName', async (req, res) => {
  try {
    const { projectName } = req.params;
    const { userId } = req.user;

    const projectDir = getProjectDir(userId, projectName);
    
    let files = null;
    
    if (fs.existsSync(projectDir)) {
      try {
        const flatFiles = await loadFilesFromDir(projectDir);
        files = [{
          name: projectName,
          path: '',
          type: 'folder',
          children: buildTreeFromFlatList(flatFiles)
        }];
      } catch (err) {
        console.error('Failed to load from directory, fallback to JSON:', err);
      }
    }
    
    if (!files) {
      let projects = {};
      try {
        const content = await fs.promises.readFile(getProjectFilePath(userId), 'utf8');
        projects = JSON.parse(content);
      } catch {
        projects = {};
      }

      const project = projects[projectName];
      if (!project) {
        return res.status(404).json({ error: '项目不存在' });
      }
      
      files = project.files;
    }

    res.json({ project: { files, path: projectDir } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:projectName', async (req, res) => {
  try {
    const { projectName } = req.params;
    const { userId } = req.user;

    const projectDir = getProjectDir(userId, projectName);
    if (fs.existsSync(projectDir)) {
      await fs.promises.rm(projectDir, { recursive: true, force: true });
    }

    let projects = {};
    try {
      const content = await fs.promises.readFile(getProjectFilePath(userId), 'utf8');
      projects = JSON.parse(content);
    } catch {
      projects = {};
    }

    if (!projects[projectName]) {
      return res.status(404).json({ error: '项目不存在' });
    }

    delete projects[projectName];
    await fs.promises.writeFile(getProjectFilePath(userId), JSON.stringify(projects, null, 2));

    res.json({ message: '项目删除成功' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:projectName/path', async (req, res) => {
  try {
    const { projectName } = req.params;
    const { userId } = req.user;

    const projectDir = getProjectDir(userId, projectName);
    res.json({ path: projectDir, exists: fs.existsSync(projectDir) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
