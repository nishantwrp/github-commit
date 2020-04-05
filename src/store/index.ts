import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const PROJECT_USERNAME_KEY = 'project_username';
const PROJECT_OWNER_AVATAR_KEY = 'project_avatar';
const PROJECT_REPO_KEY = 'project_repo';
const PROJECT_DESCRIPTION_KEY = 'project_description';

export interface Project {
  username: string | null;
  repo: string | null;
  ownerAvatar: string | null;
  description: string | null;
}

function loadFromStorage(storageKey: string) {
  return localStorage.getItem(storageKey);
}

function saveToStorage(storageKey: string, data: string | null) {
  if (!data) {
    localStorage.removeItem(storageKey);
  } else {
    localStorage.setItem(storageKey, data);
  }
}

export default new Vuex.Store({
  state: {
    project: {
      username: loadFromStorage(PROJECT_USERNAME_KEY) || null,
      ownerAvatar: loadFromStorage(PROJECT_OWNER_AVATAR_KEY) || null,
      repo: loadFromStorage(PROJECT_REPO_KEY) || null,
      description: loadFromStorage(PROJECT_DESCRIPTION_KEY) || null
    }
  },
  getters: {
    currentProject: state => {
      return state.project;
    },
    isProjectSaved: state => {
      if (state.project.repo === null || state.project.ownerAvatar === null || state.project.username === null || state.project.description === null)
        return false;
      return true;
    }
  },
  mutations: {
    NEW_PROJECT(state, project: Project) {
      state.project = project;
      saveToStorage(PROJECT_REPO_KEY, project.repo);
      saveToStorage(PROJECT_USERNAME_KEY, project.username);
      saveToStorage(PROJECT_OWNER_AVATAR_KEY, project.ownerAvatar);
      saveToStorage(PROJECT_DESCRIPTION_KEY, project.description);
    },
    REMOVE_PROJECT(state) {
      state.project = {
        repo: null,
        username: null,
        ownerAvatar: null,
        description: null
      };
      saveToStorage(PROJECT_REPO_KEY, null);
      saveToStorage(PROJECT_USERNAME_KEY, null);
      saveToStorage(PROJECT_OWNER_AVATAR_KEY, null);
      saveToStorage(PROJECT_DESCRIPTION_KEY, null);
    }
  },
  actions: {
    setupProject({ commit }, data: Project) {
      commit("NEW_PROJECT", data);
    },
    removeProject({ commit }) {
      commit("REMOVE_PROJECT");
    }
  }
})
