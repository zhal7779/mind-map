import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getFiles,
  getBookmarkFiles,
  getStorageFiles,
  patchFileTag,
  patchRestoreFile,
  deleteFile,
  postFile,
  patchFileThemeColor,
  patchFileName,
} from '../api/files';
import { IFile } from '../types/fileType';
import { alert } from '../utils/alert';
import { useNavigate } from 'react-router-dom';
import { nodeColor } from '../recoil/atoms/nodeColor';
import { useSetRecoilState } from 'recoil';

const useReadFilesQuery = (options?: { enabled?: boolean }) =>
  useQuery<IFile[], Error>({
    queryKey: ['files'],
    queryFn: getFiles,
    enabled: options?.enabled,
  });

const useReadBookmarkFilesQuery = (
  tag: string,
  options?: { enabled?: boolean }
) =>
  useQuery<IFile[], Error>({
    queryKey: ['bookmarkfiles', tag],
    queryFn: () => getBookmarkFiles(tag),
    enabled: options?.enabled,
  });

const useReadStorageFilesQuery = (options?: { enabled?: boolean }) =>
  useQuery<IFile[], Error>({
    queryKey: ['storagefiles'],
    queryFn: getStorageFiles,
    enabled: options?.enabled,
  });

const useCreateFileQuery = (queryKey: string[]) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      const response = await postFile();
      return response;
    },
    onSuccess(response) {
      const { data } = response;
      queryClient.invalidateQueries({ queryKey: queryKey });
      return navigate(`/editor/${data.file_id}`);
    },
    onError(error) {
      console.error(error);
    },
  });
};

const useUpdateFileTagQuery = (queryKey: string[]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { file_id: string; tag: string }) => {
      await patchFileTag(payload);
    },
    onSuccess() {
      return queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onError(error) {
      console.error(error);
    },
  });
};

const useUpdateFileThemeColorQuery = (queryKey: string[]) => {
  const queryClient = useQueryClient();
  const setNodeColor = useSetRecoilState(nodeColor);
  return useMutation({
    mutationFn: async (payload: { file_id: string; theme_color: string }) => {
      await patchFileThemeColor(payload);

      return payload.theme_color;
    },
    onSuccess(response) {
      setNodeColor(response);
      return queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onError(error) {
      console.error(error);
    },
  });
};

const useUpdateFileNameQuery = (queryKey: string[]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { file_id: string; file_name: string }) => {
      await patchFileName(payload);
    },
    onSuccess() {
      alert('파일이 이름이 수정되었습니다.', 'success');
      return queryClient.invalidateQueries({ queryKey: queryKey });
    },
    onError(error) {
      console.error(error);
    },
  });
};

const useUpdateRestoreFileQuery = (queryKey: string[]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { file_list: string[] }) => {
      await patchRestoreFile(payload);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: queryKey });
      return alert('파일이 복구되었습니다.', 'success');
    },
    onError(error) {
      console.error(error);
    },
  });
};

const useDeleteFileQuery = (queryKey: string[]) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { file_list: string[] }) => {
      await deleteFile(payload);
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: queryKey });

      return alert('파일이 삭제되었습니다.', 'success');
    },
    onError(error) {
      console.error(error);
    },
  });
};

export {
  useReadFilesQuery,
  useReadBookmarkFilesQuery,
  useReadStorageFilesQuery,
  useCreateFileQuery,
  useUpdateFileTagQuery,
  useUpdateFileThemeColorQuery,
  useUpdateFileNameQuery,
  useUpdateRestoreFileQuery,
  useDeleteFileQuery,
};
