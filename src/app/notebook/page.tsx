'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation'
import { useSignal, initData, type User } from '@telegram-apps/sdk-react';
import { List, Placeholder } from "@telegram-apps/telegram-ui"

import {
  DisplayData,
  type DisplayDataRow,
} from '@/components/DisplayData/DisplayData';
import { Page } from '@/components/Page';


function getUserRows(user: User): DisplayDataRow[] {
  return [
    { title: 'id', value: user.id.toString() },
    { title: 'username', value: user.username },
    { title: 'photo_url', value: user.photoUrl },
    { title: 'last_name', value: user.lastName },
    { title: 'first_name', value: user.firstName },
    { title: 'is_bot', value: user.isBot },
    { title: 'is_premium', value: user.isPremium },
    { title: 'language_code', value: user.languageCode },
    { title: 'allows_to_write_to_pm', value: user.allowsWriteToPm },
    { title: 'added_to_attachment_menu', value: user.addedToAttachmentMenu },
  ];
}

export default function InitDataPage() {
  const [firstTime, setFirstTime] = useState<boolean>(() => localStorage.getItem("firstTime")?.length ? true : false);
  const router = useRouter();

  useEffect(() => {

    router.push('/init-data');
  }, [firstTime])

  const initDataRaw = useSignal(initData.raw);
  const initDataState = useSignal(initData.state);

  const initDataRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initDataState || !initDataRaw) {
      return;
    }
    const {
      authDate,
      hash,
      queryId,
      chatType,
      chatInstance,
      canSendAfter,
      startParam,
    } = initDataState;
    return [
      { title: 'raw', value: initDataRaw },
      { title: 'auth_date', value: authDate.toLocaleString() },
      { title: 'auth_date (raw)', value: authDate.getTime() / 1000 },
      { title: 'hash', value: hash },
      {
        title: 'can_send_after',
        value: initData.canSendAfterDate()?.toISOString(),
      },
      { title: 'can_send_after (raw)', value: canSendAfter },
      { title: 'query_id', value: queryId },
      { title: 'start_param', value: startParam },
      { title: 'chat_type', value: chatType },
      { title: 'chat_instance', value: chatInstance },
    ];
  }, [initDataState, initDataRaw]);

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initDataState && initDataState.user
      ? getUserRows(initDataState.user)
      : undefined;
  }, [initDataState]);

  const receiverRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initDataState && initDataState.receiver
      ? getUserRows(initDataState.receiver)
      : undefined;
  }, [initDataState]);

  const chatRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initDataState?.chat) {
      return;
    }
    const {
      id,
      title,
      type,
      username,
      photoUrl,
    } = initDataState.chat;

    return [
      { title: 'id', value: id.toString() },
      { title: 'title', value: title },
      { title: 'type', value: type },
      { title: 'username', value: username },
      { title: 'photo_url', value: photoUrl },
    ];
  }, [initData]);

  if (!initDataRows) {
    return (
      <Page>
        <Placeholder
          header="Oops"
          description="Application was launched with missing init data"
        >
          <img
            alt="Telegram sticker"
            src="https://xelene.me/telegram.gif"
            style={{ display: 'block', width: '144px', height: '144px' }}
          />
        </Placeholder>
      </Page>
    );
  }
  return (
    <Page>
      <div className='w-full h-1/2'>

      </div>
      <div>

        <button onClick={() => { localStorage.setItem("firstTime", "false"); setFirstTime(false) }}> Start Now</button>

      </div>
    </Page >
  );
};
