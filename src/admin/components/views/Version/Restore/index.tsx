import React, { Fragment, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal, useModal } from '@faceless-ui/modal';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useConfig } from '../../../utilities/Config';
import { Button, MinimalTemplate, Pill } from '../../..';
import { Props } from './types';
import { requests } from '../../../../api';

import './index.scss';

const baseClass = 'restore-version';
const modalSlug = 'restore-version';

const Restore: React.FC<Props> = ({ collection, global, className, versionID, originalDocID, versionDate }) => {
  const { serverURL, routes: { api, admin } } = useConfig();
  const history = useHistory();
  const { toggleModal } = useModal();
  const [processing, setProcessing] = useState(false);
  const { t } = useTranslation('version');

  let fetchURL = `${serverURL}${api}`;
  let redirectURL: string;
  let restoreMessage: string;

  if (collection) {
    fetchURL = `${fetchURL}/${collection.slug}/versions/${versionID}`;
    redirectURL = `${admin}/collections/${collection.slug}/${originalDocID}`;
    restoreMessage = t('aboutToRestore', { label: collection.labels.singular, versionDate });
  }

  if (global) {
    fetchURL = `${fetchURL}/globals/${global.slug}/versions/${versionID}`;
    redirectURL = `${admin}/globals/${global.slug}`;
    restoreMessage = t('aboutToRestoreGlobal', { label: global.label, versionDate });
  }

  const handleRestore = useCallback(async () => {
    setProcessing(true);

    const res = await requests.post(fetchURL);

    if (res.status === 200) {
      const json = await res.json();
      toast.success(json.message);
      history.push(redirectURL);
    } else {
      toast.error(t('problemRestoringVersion'));
    }
  }, [fetchURL, history, redirectURL, t]);

  return (
    <Fragment>
      <Pill
        onClick={() => toggleModal(modalSlug)}
        className={[baseClass, className].filter(Boolean).join(' ')}
      >
        {t('restoreThisVersion')}
      </Pill>
      <Modal
        slug={modalSlug}
        className={`${baseClass}__modal`}
      >
        <MinimalTemplate className={`${baseClass}__modal-template`}>
          <h1>{t('confirmVersionRestoration')}</h1>
          <p>{restoreMessage}</p>
          <Button
            buttonStyle="secondary"
            type="button"
            onClick={processing ? undefined : () => toggleModal(modalSlug)}
          >
            {t('general:cancel')}
          </Button>
          <Button
            onClick={processing ? undefined : handleRestore}
          >
            {processing ? t('restoring') : t('general:confirm')}
          </Button>
        </MinimalTemplate>
      </Modal>
    </Fragment>
  );
};

export default Restore;
