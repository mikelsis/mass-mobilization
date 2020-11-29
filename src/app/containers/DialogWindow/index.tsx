// @ts-nocheck
/**
 *
 * DialogWindow
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components/macro';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectDialogWindow } from './selectors';
import { dialogWindowSaga } from './saga';
import { useParams } from 'react-router-dom';

import dialogs from './dialogs.json';
import createDialog from './dialogMamanger';

import _ from 'lodash';

interface Props {
  classState: string;
  onClose: any;
}

export function DialogWindow({ classState, onClose }: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: dialogWindowSaga });

  const [isVisible, setIsVisisble] = useState(false);
  const [activeDialog, setActiveDialog] = useState<any>([]);
  const dialogRef = useRef();

  const params = useParams();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dialogWindow = useSelector(selectDialogWindow);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  const onUpdateDialog = (dialogEntry: any) => {
    setActiveDialog(dialogEntry);
  };

  const answerDialog = (index: any) => {
    //@ts-ignore
    if (!dialogRef.current.giveAnswer(index)) closeModal();
  };

  useEffect(() => {
    setTimeout(() => {
      setIsVisisble(true);
    });

    if (params.id && params.id !== 'nodata') {
      //@ts-ignore
      dialogRef.current = createDialog(dialogs[params.id].dialog);
      //@ts-ignore
      dialogRef.current.onUpdateDialog(onUpdateDialog);
      //@ts-ignore
      dialogRef.current.startDialog();
    }

    return () => {
      setIsVisisble(false);
    };
  }, []);

  const closeModal = () => {
    // history.push('/');
    setIsVisisble(false);
    if (onClose) onClose();
  };

  return (
    <>
      <Div
        className={isVisible ? 'visible' : 'hidden'}
        style={{ backgroundImage: `url('${dialogs[params.id]?.background}')` }}
      >
        <div className="modal-window">
          <div className="close-container">
            <button onClick={closeModal} className="dialog-option close-button">
              Close
            </button>
          </div>
          {!_.isEmpty(activeDialog) ? (
            <div className="user-pane">
              {activeDialog.map(entry => {
                console.log('entry', entry);
                if (entry.role === 'user') {
                  return (
                    <div className="user-pane-option">
                      <div>
                        <button
                          className="dialog-option"
                          onClick={() => {
                            answerDialog(entry.id);
                          }}
                        >
                          {entry.text}
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="dialog-container">
                      <div
                        className="dialog-question"
                        dangerouslySetInnerHTML={{ __html: entry.text }}
                      ></div>
                      {dialogRef.current.isContiniousDialog(entry) ? (
                        entry.answers && entry.answers.length ? (
                          <button
                            className="dialog-option"
                            onClick={() => {
                              answerDialog(entry.id);
                            }}
                          >
                            Next
                          </button>
                        ) : (
                          <button
                            onClick={closeModal}
                            className="dialog-option"
                          >
                            Explore world further
                          </button>
                        )
                      ) : (
                        <div className="dialog-options-container">
                          {entry.answers &&
                            entry.answers.map(answer => {
                              return (
                                <button
                                  className="dialog-option"
                                  onClick={() => {
                                    answerDialog(answer.id);
                                  }}
                                >
                                  {answer.text}
                                </button>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          ) : (
            <div>No dialogs found for location - work in progress</div>
          )}
        </div>
      </Div>
    </>
  );
}

const Div = styled.div`
  opacity: 0;
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  background-repeat: no-repeat, no-repeat;
  background-size: cover;

  display: flex;
  align-items: flex-end;
  justify-content: center;

  transition: opacity 250ms ease;

  &.visible {
    opacity: 1;
  }

  .modal-window {
    position: relative;
    display: flex;
    background: white;
    width: 60%;
    height: 400px;

    padding: 40px;

    transform: translateY(100%);
    transition: transform 250ms 100ms ease-in;
  }

  &.visible .modal-window {
    transform: translateY(0%);
  }

  .close-container {
    position: absolute;
    top: 0;
    right: 0;
  }

  .dialog-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: center;
    height: 100%;
    justify-content: space-between;
  }

  .dialog-question {
    font-size: 29px;
    color: #bdbdbd;
  }

  .dialog-options-container {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
  }

  .dialog-option {
    border: none;
    background: transparent;
    font-size: 24px;
    color: #980000ad;
    border: 1px solid transparent;
    margin: 5px 0;

    outline: 0;

    transition: border 200ms ease;
  }

  .close-button {
    font-size: 18px;
    margin: 5px;
    color: #5a000057;
  }

  .dialog-option:hover {
    border: 1px solid #980000ad;
  }

  .close-button:hover {
    border: 1px solid #5a000057;
  }

  .user-pane {
    display: flex;
    align-items: flex-start;
    flex: 1;
  }

  .user-pane-option {
    display: flex;
    flex: 1;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  a {
    color: black;
  }
`;
