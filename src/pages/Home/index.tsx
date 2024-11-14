import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { fileDataState } from '../../recoil/atoms/fileDataState';
import { FileList } from '../../types/fileType';
import * as S from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import updateDate from '../../utils/updateDate';
import { MainTitle, SubTitle, TitlePadding } from '../../styles/common';
import NoData from '../../components/NoData';
import { useState } from 'react';

const Home = () => {
  const [fileData, setFileData] = useRecoilState(fileDataState);
  const [hoverFile, setHoverFile] = useState(-1);
  const [selectFiles, setSelectFiles] = useState<string[]>([]);

  const navigate = useNavigate();

  const updatedDate = updateDate();

  const hadleAddNewFile = () => {
    addNewFile();
    navigate(`/editor/${updatedDate}`);
  };

  const handleOpenFile = (id: string) => {
    navigate(`/editor/${id}`);
  };

  const handleMouseOver = (index: number) => {
    setHoverFile(index);
  };

  const handleMouseOut = () => {
    setHoverFile(-1);
  };

  const handleSelectFile = (id: string) => {
    setSelectFiles((prevFiles) => {
      if (!prevFiles.includes(id)) {
        return [...prevFiles, id];
      } else {
        return prevFiles.filter((item) => item !== id);
      }
    });
  };

  function addNewFile() {
    const newFileData = {
      id: updatedDate,
      fileName: '이름이 없는 파일',
      updatedDate,
      tree: {
        value: '',
        node: 0,
        level: 0,
        position: { x: 0, y: 0, r: 0, t: 0 },
        parentNode: {
          node: -1,
          position: { x: 0, y: 0, r: 0, t: 0 },
        },
        leftChildNode: [],
        rightChildNode: [],
      },
    };

    setFileData((prevFileData: FileList[]) => [...prevFileData, newFileData]);
  }

  return (
    <>
      <TitlePadding>
        <MainTitle>홈페이지</MainTitle>
      </TitlePadding>

      <S.NewFileFrame onClick={hadleAddNewFile}>
        <FontAwesomeIcon icon={faFolderPlus} />
        <p>Create new file</p>
      </S.NewFileFrame>

      <S.FileSection>
        <MainTitle>최근 열기</MainTitle>

        <SubTitle> 파일({fileData.length})</SubTitle>

        {fileData.length === 0 ? (
          <NoData />
        ) : (
          <S.FileContent>
            {fileData.map((item, index) => (
              <S.FileFrame
                key={index}
                $active={selectFiles.includes(item.id)}
                onClick={() => handleOpenFile(item.id)}
                onMouseOver={() => handleMouseOver(index)}
                onMouseOut={handleMouseOut}
              >
                <S.CheckBox
                  $hover={hoverFile === index}
                  $active={selectFiles.includes(item.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectFile(item.id);
                  }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </S.CheckBox>
                <S.FileImg></S.FileImg>
                <S.FileDes>
                  <p>{item.fileName}</p>
                  <span>{item.updatedDate} 마지막으로 수정</span>
                </S.FileDes>
              </S.FileFrame>
            ))}
          </S.FileContent>
        )}
      </S.FileSection>
    </>
  );
};

export default Home;
