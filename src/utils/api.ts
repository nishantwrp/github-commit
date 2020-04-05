import axios from "axios";
import { Project } from "../store/index";

const baseUrl = "https://api.github.com/";

function getProjectString(project: Project) {
    return project.username + "/" + project.repo + "/";
}

export function checkIfRepositoryExists(project: Project) {
    return axios.get(baseUrl + 'repos/' + getProjectString(project));
}

export function searchByCommitHash(project: Project, hash: string) {
    return axios.get(baseUrl + 'repos/' + getProjectString(project) + 'git/commits/' + hash);
}

export function searchByCommitNumber(project: Project, number: string) {
    const n = +number;
    const pageNo = Math.floor((n-1)/30) + 1;
    const commitNumber = n - ((pageNo-1)*30);
    return {
        promise: axios.get(baseUrl + 'repos/' + getProjectString(project) + 'commits?page=' + pageNo.toString()),
        commitNumber: commitNumber-1
    };
}

function getMinMaxDateInACommitsPage(project: Project, pageNumber: number) {
    return searchByCommitNumber(project, (30*pageNumber).toString()).promise.then(
        ({data}) => {
            if (!data.length) {
                return {
                    minDate: null,
                    maxDate: null
                }
            }
            return {
                maxDate: data[0].commit.author.date,
                minDate: data[data.length - 1].commit.author.date
            }
        },
        () => {
            return {
                minDate: null,
                maxDate: null
            }
        }
    )
}

function binarySearchPageNumber(project: Project, date: string, minPage: number, maxPage: number): Promise<number> {
    const page = Math.floor((minPage+maxPage)/2);
    return getMinMaxDateInACommitsPage(project, page).then(
        (data) => {
            if (data.minDate === null) {
                return binarySearchPageNumber(project, date, minPage, page-1);
            } else if (data.minDate > date) {
                return binarySearchPageNumber(project, date, page+1, maxPage);
            } else if (data.maxDate < date) {
                return binarySearchPageNumber(project, date, minPage, page-1);
            } else {
                return page;
            }
        }
    )
}

export function findCommitNumber(project: Project, sha: string, date: string) {
    const MAX_PAGE_NUMBER = 1000;
    const MIN_PAGE_NUMBER = 1;

    return binarySearchPageNumber(project, date, MIN_PAGE_NUMBER, MAX_PAGE_NUMBER).then(
        (page) => {
            return searchByCommitNumber(project, (30*page).toString()).promise.then(
                ({data}) => {
                    let i = 0;
                    while(i < data.length) {
                        if (data[i].sha === sha) {
                            return ((page-1)*30) + i + 1;
                        }
                        i++;
                    }
                }
            )
        }
    )
}