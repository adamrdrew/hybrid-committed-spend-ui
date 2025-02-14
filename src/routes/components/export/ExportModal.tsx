import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { Alert, Button, ButtonVariant, Form, FormGroup, Grid, GridItem, Modal, Radio } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import type { ReportPathsType } from 'api/reports/report';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useState } from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { styles } from './exportModal.styles';
import { ExportSubmit } from './ExportSubmit';

export interface ExportModalOwnProps {
  endDate?: string;
  groupBy?: string;
  isOpen: boolean;
  onClose(isOpen: boolean);
  query?: Query;
  reportPathsType: ReportPathsType;
  startDate?: string;
}

type ExportModalProps = ExportModalOwnProps & WrappedComponentProps;

const dataTypeOptions: {
  label: MessageDescriptor;
  value: string;
}[] = [
  { label: messages.exportDataType, value: 'json' },
  { label: messages.exportDataType, value: 'raw' },
];

const ExportModal: React.FC<ExportModalProps> = ({
  endDate,
  groupBy,
  intl,
  isOpen,
  onClose,
  query,
  reportPathsType,
  startDate,
}) => {
  const [dataType, setDataType] = useState<'json' | 'raw'>('json');
  const [error, setError] = useState<AxiosError>();

  // Reset default state upon close -- see https://issues.redhat.com/browse/COST-1134
  const handleOnClose = () => {
    if (onClose) {
      onClose(false);
    }
  };

  const handleOnDataTypeChange = (_, event) => {
    setDataType(event.currentTarget.value);
  };

  const handleOnError = (_error: AxiosError) => {
    setError(_error);
  };

  return (
    <Modal
      style={styles.modal}
      isOpen={isOpen}
      onClose={handleOnClose}
      title={intl.formatMessage(messages.exportTitle)}
      variant="small"
      actions={[
        <ExportSubmit
          dataType={dataType}
          endDate={endDate}
          groupBy={groupBy}
          key="confirm"
          onClose={handleOnClose}
          onError={handleOnError}
          query={query}
          reportPathsType={reportPathsType}
          startDate={startDate}
        />,
        <Button key="cancel" onClick={handleOnClose} variant={ButtonVariant.link}>
          {intl.formatMessage(messages.cancel)}
        </Button>,
      ]}
    >
      {error && <Alert variant="danger" style={styles.alert} title={intl.formatMessage(messages.exportError)} />}
      <div style={styles.title}>
        <span>{intl.formatMessage(messages.exportHeading, { groupBy })}</span>
      </div>
      <Form style={styles.form}>
        <Grid hasGutter md={6}>
          <GridItem span={12}>
            <FormGroup fieldId="formatType" label={intl.formatMessage(messages.exportDataTypeTitle)} isRequired>
              {dataTypeOptions.map((option, index) => (
                <Radio
                  key={index}
                  id={`formatType-${index}`}
                  isValid={option.value !== undefined}
                  label={intl.formatMessage(option.label, { value: option.value })}
                  value={option.value}
                  checked={dataType === option.value}
                  name="formatType"
                  onChange={handleOnDataTypeChange}
                  aria-label={intl.formatMessage(option.label, { value: option.value })}
                />
              ))}
            </FormGroup>
          </GridItem>
        </Grid>
      </Form>
    </Modal>
  );
};

export default injectIntl(ExportModal);
