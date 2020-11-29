import { Signal } from 'signals';

export default function createDialog(dialog: any) {
  let currentStep: number = 1;
  let onUpdateDialogFunc;

  const onUpdateDialog = func => {
    console.log('!!!!', func);
    onUpdateDialogFunc = func;
  };

  const isContiniousDialog = (dil: any) => {
    return !dil.answers.filter(answer => {
      if (answer.role) return answer.role === 'user';
      return dialog[answer].role === 'user';
    }).length;
  };

  const startDialog = () => {
    const dialogEntry = { ...dialog[currentStep] };
    if (dialogEntry && dialogEntry.answers) {
      const populatedDialog = {
        ...dialogEntry,
        answers: dialogEntry.answers.map(index => dialog[index]),
      };
      onUpdateDialogFunc && onUpdateDialogFunc([populatedDialog]);
      return [populatedDialog];
    }
  };

  const giveAnswer = (index: string) => {
    if (!dialog[index] || !dialog[index].answers) return undefined;
    const answers = [...dialog[index].answers];
    const options = answers.map(index => {
      const entry = dialog[index];
      return {
        ...entry,
        answers: entry.answers ? entry.answers.map(index => dialog[index]) : [],
      };
    });
    onUpdateDialogFunc && onUpdateDialogFunc(options);
    return options;
  };

  const nextStep = () => {};

  return {
    isContiniousDialog,
    onUpdateDialog,
    startDialog,
    giveAnswer,
    nextStep,
  };
}
