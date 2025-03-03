import { Ellipsis, MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "../../components/ui/Dropdown";
import { Link } from "react-router-dom";
import axios from "axios";
import url from "../../constants/url"
import { Spin } from 'antd';

const ticketTypesIcons = {
  regular: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M8.372 1.34876C8.2587 1.28404 8.13048 1.25 8 1.25C7.86952 1.25 7.7413 1.28404 7.628 1.34876L2.818 4.09676L8 7.13076L13.182 4.09676L8.372 1.34876ZM14 5.35676L8.75 8.42976V14.4348L13.622 11.6508C13.7368 11.5852 13.8322 11.4904 13.8986 11.3761C13.965 11.2618 14 11.132 14 10.9998V5.35676ZM7.25 14.4348V8.42976L2 5.35676V10.9998C2 11.2698 2.144 11.5178 2.378 11.6508L7.25 14.4348Z"
        fill="#34B2DA"
      />
    </svg>
  ),
  vip: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.99904 1.75C8.14711 1.7501 8.29184 1.79403 8.41498 1.87624C8.53813 1.95846 8.63419 2.07529 8.69104 2.212L10.101 5.605L13.765 5.898C13.9127 5.90988 14.0535 5.9652 14.1697 6.05699C14.286 6.14878 14.3724 6.27293 14.4182 6.41379C14.464 6.55464 14.467 6.7059 14.4269 6.84849C14.3869 6.99108 14.3055 7.11861 14.193 7.215L11.402 9.605L12.255 13.18C12.2893 13.324 12.2802 13.475 12.2288 13.6138C12.1774 13.7527 12.0861 13.8733 11.9663 13.9603C11.8466 14.0473 11.7037 14.097 11.5558 14.103C11.4079 14.109 11.2615 14.0711 11.135 13.994L7.99704 12.08L4.86204 13.995C4.73562 14.0721 4.58922 14.11 4.44129 14.104C4.29336 14.098 4.15051 14.0483 4.03074 13.9613C3.91097 13.8743 3.81965 13.7537 3.76828 13.6149C3.7169 13.476 3.70777 13.325 3.74204 13.181L4.59404 9.607L1.80404 7.217C1.69129 7.12074 1.6096 6.99323 1.56928 6.85056C1.52896 6.7079 1.53183 6.55648 1.57753 6.41545C1.62322 6.27441 1.70968 6.15008 1.826 6.05816C1.94232 5.96624 2.08327 5.91086 2.23104 5.899L5.89404 5.606L7.30404 2.213C7.36094 2.07563 7.45739 1.95826 7.58114 1.87582C7.70489 1.79338 7.85035 1.74959 7.99904 1.75Z"
        fill="#A3E635"
      />
    </svg>
  ),
  "early bird": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M10.6693 4.66781H10.6759M2.26927 12.0012H8.0026C9.41709 12.0012 10.7736 11.4393 11.7738 10.4391C12.774 9.43889 13.3359 8.08234 13.3359 6.66785V4.66785M13.3359 4.66785C13.3374 4.09979 13.1575 3.5461 12.8223 3.08744C12.4872 2.62879 12.0143 2.28916 11.4726 2.11803C10.931 1.94689 10.3488 1.95321 9.81096 2.13605C9.27313 2.31889 8.80774 2.66871 8.4826 3.13452L1.33594 13.3345M13.3359 4.66785L14.6693 5.00114L13.3359 5.33447M6.66927 12.0011V14.0011M9.33594 11.8345V14.0011M4.66927 12.0011C5.49135 12.001 6.29345 11.7477 6.96642 11.2755C7.63939 10.8034 8.15054 10.1354 8.43031 9.36235C8.71008 8.58934 8.74488 7.7489 8.52998 6.95541C8.31507 6.16191 7.8609 5.45391 7.22927 4.92773"
        stroke="#F97316"
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const statusIcons = {
  completed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM11.844 6.209C11.9657 6.05146 12.0199 5.85202 11.9946 5.65454C11.9693 5.45706 11.8665 5.27773 11.709 5.156C11.5515 5.03427 11.352 4.9801 11.1545 5.00542C10.9571 5.03073 10.7777 5.13346 10.656 5.291L6.956 10.081L5.307 8.248C5.24174 8.17247 5.16207 8.11073 5.07264 8.06639C4.98322 8.02205 4.88584 7.99601 4.78622 7.98978C4.6866 7.98356 4.58674 7.99729 4.4925 8.03016C4.39825 8.06303 4.31151 8.11438 4.23737 8.1812C4.16322 8.24803 4.10316 8.32898 4.06071 8.41931C4.01825 8.50965 3.99425 8.60755 3.99012 8.70728C3.98599 8.807 4.00181 8.90656 4.03664 9.00009C4.07148 9.09363 4.12464 9.17927 4.193 9.252L6.443 11.752C6.51649 11.8335 6.60697 11.8979 6.70806 11.9406C6.80915 11.9833 6.91838 12.0034 7.02805 11.9993C7.13772 11.9952 7.24515 11.967 7.34277 11.9169C7.44038 11.8667 7.5258 11.7958 7.593 11.709L11.844 6.209Z"
        fill="#10B981"
      />
    </svg>
  ),
  refunded: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4993 9.75009C12.4993 9.38896 12.4282 9.03136 12.29 8.69771C12.1518 8.36407 11.9492 8.06091 11.6939 7.80555C11.4385 7.55019 11.1354 7.34762 10.8017 7.20942C10.4681 7.07122 10.1105 7.00009 9.74934 7.00009H4.55934L6.77934 9.22009C6.85303 9.28875 6.91213 9.37155 6.95312 9.46355C6.99411 9.55555 7.01615 9.65487 7.01793 9.75557C7.01971 9.85627 7.00118 9.9563 6.96346 10.0497C6.92574 10.1431 6.8696 10.2279 6.79838 10.2991C6.72716 10.3703 6.64233 10.4265 6.54894 10.4642C6.45555 10.5019 6.35552 10.5205 6.25482 10.5187C6.15411 10.5169 6.0548 10.4949 5.9628 10.4539C5.8708 10.4129 5.788 10.3538 5.71934 10.2801L2.21934 6.78009C2.07889 6.63947 2 6.44884 2 6.25009C2 6.05134 2.07889 5.86072 2.21934 5.72009L5.71934 2.22009C5.86151 2.08761 6.04956 2.01549 6.24386 2.01892C6.43816 2.02234 6.62355 2.10106 6.76096 2.23847C6.89838 2.37588 6.97709 2.56127 6.98052 2.75557C6.98394 2.94987 6.91182 3.13792 6.77934 3.28009L4.55934 5.50009H9.74934C10.8765 5.50009 11.9575 5.94786 12.7545 6.74489C13.5516 7.54192 13.9993 8.62292 13.9993 9.75009C13.9993 10.8773 13.5516 11.9583 12.7545 12.7553C11.9575 13.5523 10.8765 14.0001 9.74934 14.0001H8.74934C8.55043 14.0001 8.35966 13.9211 8.21901 13.7804C8.07836 13.6398 7.99934 13.449 7.99934 13.2501C7.99934 13.0512 8.07836 12.8604 8.21901 12.7198C8.35966 12.5791 8.55043 12.5001 8.74934 12.5001H9.74934C10.1105 12.5001 10.4681 12.429 10.8017 12.2908C11.1354 12.1526 11.4385 11.95 11.6939 11.6946C11.9492 11.4393 12.1518 11.1361 12.29 10.8025C12.4282 10.4688 12.4993 10.1112 12.4993 9.75009Z"
        fill="#F97316"
      />
    </svg>
  ),
  pending: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4993 9.75009C12.4993 9.38896 12.4282 9.03136 12.29 8.69771C12.1518 8.36407 11.9492 8.06091 11.6939 7.80555C11.4385 7.55019 11.1354 7.34762 10.8017 7.20942C10.4681 7.07122 10.1105 7.00009 9.74934 7.00009H4.55934L6.77934 9.22009C6.85303 9.28875 6.91213 9.37155 6.95312 9.46355C6.99411 9.55555 7.01615 9.65487 7.01793 9.75557C7.01971 9.85627 7.00118 9.9563 6.96346 10.0497C6.92574 10.1431 6.8696 10.2279 6.79838 10.2991C6.72716 10.3703 6.64233 10.4265 6.54894 10.4642C6.45555 10.5019 6.35552 10.5205 6.25482 10.5187C6.15411 10.5169 6.0548 10.4949 5.9628 10.4539C5.8708 10.4129 5.788 10.3538 5.71934 10.2801L2.21934 6.78009C2.07889 6.63947 2 6.44884 2 6.25009C2 6.05134 2.07889 5.86072 2.21934 5.72009L5.71934 2.22009C5.86151 2.08761 6.04956 2.01549 6.24386 2.01892C6.43816 2.02234 6.62355 2.10106 6.76096 2.23847C6.89838 2.37588 6.97709 2.56127 6.98052 2.75557C6.98394 2.94987 6.91182 3.13792 6.77934 3.28009L4.55934 5.50009H9.74934C10.8765 5.50009 11.9575 5.94786 12.7545 6.74489C13.5516 7.54192 13.9993 8.62292 13.9993 9.75009C13.9993 10.8773 13.5516 11.9583 12.7545 12.7553C11.9575 13.5523 10.8765 14.0001 9.74934 14.0001H8.74934C8.55043 14.0001 8.35966 13.9211 8.21901 13.7804C8.07836 13.6398 7.99934 13.449 7.99934 13.2501C7.99934 13.0512 8.07836 12.8604 8.21901 12.7198C8.35966 12.5791 8.55043 12.5001 8.74934 12.5001H9.74934C10.1105 12.5001 10.4681 12.429 10.8017 12.2908C11.1354 12.1526 11.4385 11.95 11.6939 11.6946C11.9492 11.4393 12.1518 11.1361 12.29 10.8025C12.4282 10.4688 12.4993 10.1112 12.4993 9.75009Z"
        fill="#F97316"
      />
    </svg>
  ),
  failed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM10.78 10.78C10.6394 10.9205 10.4488 10.9993 10.25 10.9993C10.0512 10.9993 9.86063 10.9205 9.72 10.78L8 9.06L6.28 10.78C6.21134 10.8537 6.12854 10.9128 6.03654 10.9538C5.94454 10.9948 5.84523 11.0168 5.74452 11.0186C5.64382 11.0204 5.54379 11.0018 5.4504 10.9641C5.35701 10.9264 5.27218 10.8703 5.20096 10.799C5.12974 10.7278 5.0736 10.643 5.03588 10.5496C4.99816 10.4562 4.97963 10.3562 4.98141 10.2555C4.98319 10.1548 5.00523 10.0555 5.04622 9.96346C5.08721 9.87146 5.14631 9.78866 5.22 9.72L6.94 8L5.22 6.28C5.08752 6.13783 5.0154 5.94978 5.01883 5.75548C5.02225 5.56118 5.10097 5.37579 5.23838 5.23838C5.37579 5.10097 5.56118 5.02225 5.75548 5.01883C5.94978 5.0154 6.13783 5.08752 6.28 5.22L8 6.94L9.72 5.22C9.78866 5.14631 9.87146 5.08721 9.96346 5.04622C10.0555 5.00523 10.1548 4.98319 10.2555 4.98141C10.3562 4.97963 10.4562 4.99816 10.5496 5.03588C10.643 5.0736 10.7278 5.12974 10.799 5.20096C10.8703 5.27218 10.9264 5.35701 10.9641 5.4504C11.0018 5.54379 11.0204 5.64382 11.0186 5.74452C11.0168 5.84523 10.9948 5.94454 10.9538 6.03654C10.9128 6.12854 10.8537 6.21134 10.78 6.28L9.06 8L10.78 9.72C10.9205 9.86063 10.9993 10.0512 10.9993 10.25C10.9993 10.4488 10.9205 10.6394 10.78 10.78Z"
        fill="#F43F5E"
      />
    </svg>
  ),
};

const saleTypesIcons = {
  sale: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 3C1 2.73478 1.10536 2.48043 1.29289 2.29289C1.48043 2.10536 1.73478 2 2 2H14C14.2652 2 14.5196 2.10536 14.7071 2.29289C14.8946 2.48043 15 2.73478 15 3V9C15 9.26522 14.8946 9.51957 14.7071 9.70711C14.5196 9.89464 14.2652 10 14 10H2C1.73478 10 1.48043 9.89464 1.29289 9.70711C1.10536 9.51957 1 9.26522 1 9V3ZM10 6C10 6.53043 9.78929 7.03914 9.41421 7.41421C9.03914 7.78929 8.53043 8 8 8C7.46957 8 6.96086 7.78929 6.58579 7.41421C6.21071 7.03914 6 6.53043 6 6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4C8.53043 4 9.03914 4.21071 9.41421 4.58579C9.78929 4.96086 10 5.46957 10 6ZM3.75 5.25C3.55109 5.25 3.36032 5.32902 3.21967 5.46967C3.07902 5.61032 3 5.80109 3 6C3 6.19891 3.07902 6.38968 3.21967 6.53033C3.36032 6.67098 3.55109 6.75 3.75 6.75C3.94891 6.75 4.13968 6.67098 4.28033 6.53033C4.42098 6.38968 4.5 6.19891 4.5 6C4.5 5.80109 4.42098 5.61032 4.28033 5.46967C4.13968 5.32902 3.94891 5.25 3.75 5.25ZM11.5 6C11.5 5.80109 11.579 5.61032 11.7197 5.46967C11.8603 5.32902 12.0511 5.25 12.25 5.25C12.4489 5.25 12.6397 5.32902 12.7803 5.46967C12.921 5.61032 13 5.80109 13 6C13 6.19891 12.921 6.38968 12.7803 6.53033C12.6397 6.67098 12.4489 6.75 12.25 6.75C12.0511 6.75 11.8603 6.67098 11.7197 6.53033C11.579 6.38968 11.5 6.19891 11.5 6Z"
        fill="#A3E635"
      />
      <path
        d="M13 11.75C13 11.5511 12.921 11.3603 12.7803 11.2197C12.6397 11.079 12.4489 11 12.25 11C12.0511 11 11.8603 11.079 11.7197 11.2197C11.579 11.3603 11.5 11.5511 11.5 11.75V11.929C11.5 12.079 11.362 12.209 11.194 12.184C8.06671 11.7277 4.91041 11.4991 1.75 11.5C1.55109 11.5 1.36032 11.579 1.21967 11.7197C1.07902 11.8603 1 12.0511 1 12.25C1 12.4489 1.07902 12.6397 1.21967 12.7803C1.36032 12.921 1.55109 13 1.75 13C4.885 13 7.965 13.228 10.977 13.668C11.2274 13.7052 11.4828 13.688 11.726 13.6177C11.9692 13.5474 12.1944 13.4256 12.3863 13.2605C12.5782 13.0954 12.7323 12.891 12.8382 12.6611C12.9441 12.4311 12.9993 12.1811 13 11.928V11.75Z"
        fill="#A3E635"
      />
    </svg>
  ),
  refund: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4993 9.75009C12.4993 9.38896 12.4282 9.03136 12.29 8.69771C12.1518 8.36407 11.9492 8.06091 11.6939 7.80555C11.4385 7.55019 11.1354 7.34762 10.8017 7.20942C10.4681 7.07122 10.1105 7.00009 9.74934 7.00009H4.55934L6.77934 9.22009C6.85303 9.28875 6.91213 9.37155 6.95312 9.46355C6.99411 9.55555 7.01615 9.65487 7.01793 9.75557C7.01971 9.85627 7.00118 9.9563 6.96346 10.0497C6.92574 10.1431 6.8696 10.2279 6.79838 10.2991C6.72716 10.3703 6.64233 10.4265 6.54894 10.4642C6.45555 10.5019 6.35552 10.5205 6.25482 10.5187C6.15411 10.5169 6.0548 10.4949 5.9628 10.4539C5.8708 10.4129 5.788 10.3538 5.71934 10.2801L2.21934 6.78009C2.07889 6.63947 2 6.44884 2 6.25009C2 6.05134 2.07889 5.86072 2.21934 5.72009L5.71934 2.22009C5.86151 2.08761 6.04956 2.01549 6.24386 2.01892C6.43816 2.02234 6.62355 2.10106 6.76096 2.23847C6.89838 2.37588 6.97709 2.56127 6.98052 2.75557C6.98394 2.94987 6.91182 3.13792 6.77934 3.28009L4.55934 5.50009H9.74934C10.8765 5.50009 11.9575 5.94786 12.7545 6.74489C13.5516 7.54192 13.9993 8.62292 13.9993 9.75009C13.9993 10.8773 13.5516 11.9583 12.7545 12.7553C11.9575 13.5523 10.8765 14.0001 9.74934 14.0001H8.74934C8.55043 14.0001 8.35966 13.9211 8.21901 13.7804C8.07836 13.6398 7.99934 13.449 7.99934 13.2501C7.99934 13.0512 8.07836 12.8604 8.21901 12.7198C8.35966 12.5791 8.55043 12.5001 8.74934 12.5001H9.74934C10.1105 12.5001 10.4681 12.429 10.8017 12.2908C11.1354 12.1526 11.4385 11.95 11.6939 11.6946C11.9492 11.4393 12.1518 11.1361 12.29 10.8025C12.4282 10.4688 12.4993 10.1112 12.4993 9.75009Z"
        fill="#F97316"
      />
    </svg>
  ),
  failed: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 15C9.85652 15 11.637 14.2625 12.9497 12.9497C14.2625 11.637 15 9.85652 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1C6.14348 1 4.36301 1.7375 3.05025 3.05025C1.7375 4.36301 1 6.14348 1 8C1 9.85652 1.7375 11.637 3.05025 12.9497C4.36301 14.2625 6.14348 15 8 15ZM10.78 10.78C10.6394 10.9205 10.4488 10.9993 10.25 10.9993C10.0512 10.9993 9.86063 10.9205 9.72 10.78L8 9.06L6.28 10.78C6.21134 10.8537 6.12854 10.9128 6.03654 10.9538C5.94454 10.9948 5.84523 11.0168 5.74452 11.0186C5.64382 11.0204 5.54379 11.0018 5.4504 10.9641C5.35701 10.9264 5.27218 10.8703 5.20096 10.799C5.12974 10.7278 5.0736 10.643 5.03588 10.5496C4.99816 10.4562 4.97963 10.3562 4.98141 10.2555C4.98319 10.1548 5.00523 10.0555 5.04622 9.96346C5.08721 9.87146 5.14631 9.78866 5.22 9.72L6.94 8L5.22 6.28C5.08752 6.13783 5.0154 5.94978 5.01883 5.75548C5.02225 5.56118 5.10097 5.37579 5.23838 5.23838C5.37579 5.10097 5.56118 5.02225 5.75548 5.01883C5.94978 5.0154 6.13783 5.08752 6.28 5.22L8 6.94L9.72 5.22C9.78866 5.14631 9.87146 5.08721 9.96346 5.04622C10.0555 5.00523 10.1548 4.98319 10.2555 4.98141C10.3562 4.97963 10.4562 4.99816 10.5496 5.03588C10.643 5.0736 10.7278 5.12974 10.799 5.20096C10.8703 5.27218 10.9264 5.35701 10.9641 5.4504C11.0018 5.54379 11.0204 5.64382 11.0186 5.74452C11.0168 5.84523 10.9948 5.94454 10.9538 6.03654C10.9128 6.12854 10.8537 6.21134 10.78 6.28L9.06 8L10.78 9.72C10.9205 9.86063 10.9993 10.0512 10.9993 10.25C10.9993 10.4488 10.9205 10.6394 10.78 10.78Z"
        fill="#F43F5E"
      />
    </svg>
  ),
};

const eventSalesHistory = [
  {
    date: "Today 13:55",
    type: "sale",
    ticket: "regular",
    name: "Devon Lane",
    email: "alexander.smith@...",
    amount: 198,
    status: "completed",
    totalTicketHeadCount: "3",
  },
  {
    date: "Today 13:55",
    type: "refund",
    ticket: "regular",
    name: "Kristin Watson",
    email: "kristin.watson@...",
    amount: -99,
    status: "refunded",
    totalTicketHeadCount: "1",
  },
  {
    amount: 299,
    type: "sale",
    ticket: "regular",
    name: "Darrell Steward",
    date: "Today 12:30",
    reference: "darrell.perkins...",
    status: "completed",
    totalTicketHeadCount: "1",
  },
  {
    amount: -148,
    type: "refund",
    ticket: "vip",
    name: "Savannah Nguyen",
    date: "Yesterday 23:15",
    reference: "emily.davis@...",
    status: "pending",
    totalTicketHeadCount: "1",
  },
  {
    amount: 29,
    type: "sale",
    ticket: "regular",
    name: "Annette Black",
    date: "22 Jan 06:56",
    reference: "annie.martinez@...",
    status: "pending",
    totalTicketHeadCount: "1",
  },
  {
    date: "Today 14:00",
    type: "sale",
    ticket: "early bird",
    name: "John Doe",
    email: "john.doe@example.com",
    amount: 150,
    status: "completed",
    totalTicketHeadCount: "2",
  },
];

export default function SalesTab({ eventId, event }) {
  const [timeFilter, setTimeFilter] = useState("All time");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [ticketFilter, setTicketFilter] = useState("All tickets");
  const [searchQuery, setSearchQuery] = useState("");

  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(false)

  const filteredSalesHistory = book.filter((sale) => {
    const isRefund = sale.refund === "true";
    if (
      ticketFilter !== "All tickets" &&
      sale?.tickets?.ticket_name.toLowerCase() !== ticketFilter.toLowerCase()
    ) {
      return false;
    }

    if (
      typeFilter !== "All types" &&
      ((typeFilter.toLowerCase() === "refund" && !isRefund) ||
        (typeFilter.toLowerCase() === "sale" && isRefund))
    ) {
      return false;
    }


    const saleDate = new Date(
      sale.date
        .replace("Today", new Date().toDateString())
        .replace("Yesterday", new Date(Date.now() - 86400000).toDateString())
    );
    const last7Days = new Date(Date.now() - 7 * 86400000);
    const last30Days = new Date(Date.now() - 30 * 86400000);
    const last90Days = new Date(Date.now() - 90 * 86400000);

    if (timeFilter === "Last 7 days" && saleDate < last7Days) {
      return false;
    }
    if (timeFilter === "Last 30 days" && saleDate < last30Days) {
      return false;
    }
    if (timeFilter === "Last 90 days" && saleDate < last90Days) {
      return false;
    }

    // Filter by search query
    const searchLower = searchQuery.toLowerCase();
    return (
      searchQuery === "" ||
      (sale.firstName?.toLowerCase() || "").includes(searchLower) ||
      (sale.email?.toLowerCase() || "").includes(searchLower)
    );
  });

  const totalAmount = filteredSalesHistory
    .filter(payment => payment.refund !== "true")
    .reduce((sum, sale) => {
      if (!sale.amount) return sum;
      const amountAfterFee = (Number(sale.amount / 100) - 0.89) / 1.09;
      return sum + amountAfterFee;
    }, 0);

  const totalRefundAmount = filteredSalesHistory.reduce((sum, sale) => {
    if (sale.refund === "true" && sale.amount) {
      const amountAfterFee = (Number(sale.amount) / 100 - 0.89) / 1.09;
      return sum + amountAfterFee;
    }
    return sum;
  }, 0);

  const totalSalesAmount = totalAmount + totalRefundAmount;
  const successRate = totalSalesAmount > 0
    ? ((totalAmount / totalSalesAmount) * 100).toFixed(2)
    : 0;


  const statsData = [
    {
      title: "Total Transactions",
      amount: `$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+6%",
      isPositive: true,
      redirection: "/organizer/wallet",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <path
            d="M7.125 5.5H8V7.25H7.125C7.01009 7.25 6.89631 7.22737 6.79015 7.18339C6.68399 7.13942 6.58753 7.07497 6.50628 6.99372C6.42503 6.91247 6.36058 6.81601 6.31661 6.70985C6.27263 6.60369 6.25 6.48991 6.25 6.375C6.25 6.26009 6.27263 6.14631 6.31661 6.04015C6.36058 5.93399 6.42503 5.83753 6.50628 5.75628C6.58753 5.67503 6.68399 5.61058 6.79015 5.56661C6.89631 5.52263 7.01009 5.5 7.125 5.5ZM9.5 10.5V8.75H10.375C10.6071 8.75 10.8296 8.84219 10.9937 9.00628C11.1578 9.17038 11.25 9.39294 11.25 9.625C11.25 9.85706 11.1578 10.0796 10.9937 10.2437C10.8296 10.4078 10.6071 10.5 10.375 10.5H9.5Z"
            fill="white"
            fillOpacity="0.5"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.75 8C15.75 9.85652 15.0125 11.637 13.6997 12.9497C12.387 14.2625 10.6065 15 8.75 15C6.89348 15 5.11301 14.2625 3.80025 12.9497C2.4875 11.637 1.75 9.85652 1.75 8C1.75 6.14348 2.4875 4.36301 3.80025 3.05025C5.11301 1.7375 6.89348 1 8.75 1C10.6065 1 12.387 1.7375 13.6997 3.05025C15.0125 4.36301 15.75 6.14348 15.75 8ZM8 3.75C8 3.55109 8.07902 3.36032 8.21967 3.21967C8.36032 3.07902 8.55109 3 8.75 3C8.94891 3 9.13968 3.07902 9.28033 3.21967C9.42098 3.36032 9.5 3.55109 9.5 3.75V4H12C12.1989 4 12.3897 4.07902 12.5303 4.21967C12.671 4.36032 12.75 4.55109 12.75 4.75C12.75 4.94891 12.671 5.13968 12.5303 5.28033C12.3897 5.42098 12.1989 5.5 12 5.5H9.5V7.25H10.375C11.0049 7.25 11.609 7.50022 12.0544 7.94562C12.4998 8.39102 12.75 8.99511 12.75 9.625C12.75 10.2549 12.4998 10.859 12.0544 11.3044C11.609 11.7498 11.0049 12 10.375 12H9.5V12.25C9.5 12.4489 9.42098 12.6397 9.28033 12.7803C9.13968 12.921 8.94891 13 8.75 13C8.55109 13 8.36032 12.921 8.21967 12.7803C8.07902 12.6397 8 12.4489 8 12.25V12H5.5C5.30109 12 5.11032 11.921 4.96967 11.7803C4.82902 11.6397 4.75 11.4489 4.75 11.25C4.75 11.0511 4.82902 10.8603 4.96967 10.7197C5.11032 10.579 5.30109 10.5 5.5 10.5H8V8.75H7.125C6.49511 8.75 5.89102 8.49978 5.44562 8.05438C5.00022 7.60898 4.75 7.00489 4.75 6.375C4.75 5.74511 5.00022 5.14102 5.44562 4.69562C5.89102 4.25022 6.49511 4 7.125 4H8V3.75Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
    },
    {
      title: "Refunded amount",
      amount: `$${totalRefundAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "-4%",
      isPositive: false,
      redirection: "",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.2501 9.74985C13.2501 9.38871 13.1789 9.03111 13.0407 8.69747C12.9025 8.36382 12.7 8.06066 12.4446 7.8053C12.1893 7.54994 11.8861 7.34738 11.5525 7.20918C11.2188 7.07098 10.8612 6.99985 10.5001 6.99985H5.31007L7.53007 9.21985C7.60376 9.28851 7.66286 9.37131 7.70385 9.46331C7.74485 9.55531 7.76689 9.65462 7.76866 9.75532C7.77044 9.85603 7.75192 9.95606 7.7142 10.0494C7.67647 10.1428 7.62033 10.2277 7.54911 10.2989C7.47789 10.3701 7.39306 10.4262 7.29967 10.464C7.20628 10.5017 7.10625 10.5202 7.00555 10.5184C6.90485 10.5167 6.80553 10.4946 6.71353 10.4536C6.62154 10.4126 6.53873 10.3535 6.47007 10.2798L2.97007 6.77985C2.82962 6.63922 2.75073 6.4486 2.75073 6.24985C2.75073 6.0511 2.82962 5.86047 2.97007 5.71985L6.47007 2.21985C6.61225 2.08737 6.80029 2.01524 6.9946 2.01867C7.1889 2.0221 7.37428 2.10081 7.51169 2.23822C7.64911 2.37564 7.72782 2.56102 7.73125 2.75532C7.73468 2.94963 7.66255 3.13767 7.53007 3.27985L5.31007 5.49985H10.5001C11.6272 5.49985 12.7082 5.94761 13.5053 6.74464C14.3023 7.54167 14.7501 8.62268 14.7501 9.74985C14.7501 10.877 14.3023 11.958 13.5053 12.7551C12.7082 13.5521 11.6272 13.9998 10.5001 13.9998H9.50007C9.30116 13.9998 9.11039 13.9208 8.96974 13.7802C8.82909 13.6395 8.75007 13.4488 8.75007 13.2498C8.75007 13.0509 8.82909 12.8602 8.96974 12.7195C9.11039 12.5789 9.30116 12.4998 9.50007 12.4998H10.5001C10.8612 12.4998 11.2188 12.4287 11.5525 12.2905C11.8861 12.1523 12.1893 11.9498 12.4446 11.6944C12.7 11.439 12.9025 11.1359 13.0407 10.8022C13.1789 10.4686 13.2501 10.111 13.2501 9.74985Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
    },
    {
      title: "Success rate",
      amount: `${successRate} %`,
      change: "+8%",
      isPositive: true,
      redirection: "/organizer/events",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.25 15C10.1065 15 11.887 14.2625 13.1997 12.9497C14.5125 11.637 15.25 9.85652 15.25 8C15.25 6.14348 14.5125 4.36301 13.1997 3.05025C11.887 1.7375 10.1065 1 8.25 1C6.39348 1 4.61301 1.7375 3.30025 3.05025C1.9875 4.36301 1.25 6.14348 1.25 8C1.25 9.85652 1.9875 11.637 3.30025 12.9497C4.61301 14.2625 6.39348 15 8.25 15ZM12.094 6.209C12.2157 6.05146 12.2699 5.85202 12.2446 5.65454C12.2193 5.45706 12.1165 5.27773 11.959 5.156C11.8015 5.03427 11.602 4.9801 11.4045 5.00542C11.2071 5.03073 11.0277 5.13346 10.906 5.291L7.206 10.081L5.557 8.248C5.49174 8.17247 5.41207 8.11073 5.32264 8.06639C5.23322 8.02205 5.13584 7.99601 5.03622 7.98978C4.9366 7.98356 4.83674 7.99729 4.7425 8.03016C4.64825 8.06303 4.56151 8.11438 4.48737 8.1812C4.41322 8.24803 4.35316 8.32898 4.31071 8.41931C4.26825 8.50965 4.24425 8.60755 4.24012 8.70728C4.23599 8.807 4.25181 8.90656 4.28664 9.00009C4.32148 9.09363 4.37464 9.17927 4.443 9.252L6.693 11.752C6.76649 11.8335 6.85697 11.8979 6.95806 11.9406C7.05915 11.9833 7.16838 12.0034 7.27805 11.9993C7.38772 11.9952 7.49515 11.967 7.59277 11.9169C7.69038 11.8667 7.7758 11.7958 7.843 11.709L12.094 6.209Z"
            fill="white"
            fillOpacity="0.5"
          />
        </svg>
      ),
    },
  ];

  const fetchBook = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}/get-event-payment-list/${eventId}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBook()
  }, [eventId])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = "20" + date.getFullYear().toString().slice(-2);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${dayOfWeek}, ${day} ${month} ${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="@container grid gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {statsData.map((stat, index) => (
          <Link
            key={index}
            className={`p-4 rounded-xl border border-white/5 bg-opacity-5 backdrop-blur-sm cursor-default`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-col items-start gap-3">
                  <p className="text-gray-400 flex items-center">
                    <span>{stat.title}</span>
                    {
                      stat.title === "Revenue" || stat.title === "Currently Live" ? (
                        <span className="ml-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.22007 11.78C4.07962 11.6394 4.00073 11.4488 4.00073 11.25C4.00073 11.0512 4.07962 10.8606 4.22007 10.72L9.44007 5.5H5.75007C5.55116 5.5 5.36039 5.42098 5.21974 5.28033C5.07909 5.13968 5.00007 4.94891 5.00007 4.75C5.00007 4.55109 5.07909 4.36032 5.21974 4.21967C5.36039 4.07902 5.55116 4 5.75007 4H11.2501C11.449 4 11.6398 4.07902 11.7804 4.21967C11.9211 4.36032 12.0001 4.55109 12.0001 4.75V10.25C12.0001 10.4489 11.9211 10.6397 11.7804 10.7803C11.6398 10.921 11.449 11 11.2501 11C11.0512 11 10.8604 10.921 10.7197 10.7803C10.5791 10.6397 10.5001 10.4489 10.5001 10.25V6.56L5.28007 11.78C5.13945 11.9205 4.94882 11.9993 4.75007 11.9993C4.55132 11.9993 4.3607 11.9205 4.22007 11.78Z"
                              fill="white"
                              fillOpacity="0.5"
                            />
                          </svg>
                        </span>
                      ) : (
                        ""
                      )
                    }
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{stat.amount}</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
                  {stat.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-col @4xl:flex-row gap-3 w-full justify-between items-start @4xl:items-center mt-8">
        <div className="flex gap-3 flex-wrap items-center">
          {/* All time filter */}
          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center gap-2 text-sm border border-white/10 px-3 py-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4 1.75C4 1.55109 4.07902 1.36032 4.21967 1.21967C4.36032 1.07902 4.55109 1 4.75 1C4.94891 1 5.13968 1.07902 5.28033 1.21967C5.42098 1.36032 5.5 1.55109 5.5 1.75V3H10.5V1.75C10.5 1.55109 10.579 1.36032 10.7197 1.21967C10.8603 1.07902 11.0511 1 11.25 1C11.4489 1 11.6397 1.07902 11.7803 1.21967C11.921 1.36032 12 1.55109 12 1.75V3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5V12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14H4C3.46957 14 2.96086 13.7893 2.58579 13.4142C2.21071 13.0391 2 12.5304 2 12V5C2 4.46957 2.21071 3.96086 2.58579 3.58579C2.96086 3.21071 3.46957 3 4 3V1.75ZM4.5 6C4.23478 6 3.98043 6.10536 3.79289 6.29289C3.60536 6.48043 3.5 6.73478 3.5 7V11.5C3.5 11.7652 3.60536 12.0196 3.79289 12.2071C3.98043 12.3946 4.23478 12.5 4.5 12.5H11.5C11.7652 12.5 12.0196 12.3946 12.2071 12.2071C12.3946 12.0196 12.5 11.7652 12.5 11.5V7C12.5 6.73478 12.3946 6.48043 12.2071 6.29289C12.0196 6.10536 11.7652 6 11.5 6H4.5Z"
                    fill="white"
                    fillOpacity="0.5"
                  />
                </svg>
                {timeFilter}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </DropdownTrigger>
            <DropdownContent
              align="left"
              className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden"
            >
              <DropdownItem
                onClick={() => setTimeFilter("All time")}
                className="px-4 py-2 hover:bg-white/5 text-white"
              >
                All time
              </DropdownItem>
              <DropdownItem
                onClick={() => setTimeFilter("Last 7 days")}
                className="px-4 py-2 hover:bg-white/5 text-white"
              >
                Last 7 days
              </DropdownItem>
              <DropdownItem
                onClick={() => setTimeFilter("Last 30 days")}
                className="px-4 py-2 hover:bg-white/5 text-white"
              >
                Last 30 days
              </DropdownItem>
              <DropdownItem
                onClick={() => setTimeFilter("Last 90 days")}
                className="px-4 py-2 hover:bg-white/5 text-white"
              >
                Last 90 days
              </DropdownItem>
            </DropdownContent>
          </Dropdown>

          {/* All types filter */}
          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center gap-2 text-sm border border-white/10 px-3 py-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7.628 1.34876C7.7413 1.28404 7.86952 1.25 8 1.25C8.13048 1.25 8.2587 1.28404 8.372 1.34876L13.182 4.09676L8 7.13076L2.818 4.09676L7.628 1.34876ZM14 5.35676L8.75 8.42976V14.4348L13.622 11.6508C13.7368 11.5852 13.8322 11.4904 13.8986 11.3761C13.965 11.2618 14 11.132 14 10.9998V5.35676ZM7.25 14.4348V8.42976L2 5.35676V10.9998C2 11.2698 2.144 11.5178 2.378 11.6508L7.25 14.4348Z"
                    fill="white"
                    fillOpacity="0.5"
                  />
                </svg>
                {typeFilter}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </DropdownTrigger>
            <DropdownContent
              align="left"
              className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden"
            >
              <DropdownItem
                onClick={() => setTypeFilter("All types")}
                className="px-4 py-2 hover:bg-white/5 text-white"
              >
                All types
              </DropdownItem>
              <DropdownItem
                onClick={() => setTypeFilter("Sale")}
                className="px-4 py-2 hover:bg-white/5 text-white"
              >
                Sale
              </DropdownItem>
              <DropdownItem
                onClick={() => setTypeFilter("Refund")}
                className="px-4 py-2 hover:bg-white/5 text-white"
              >
                Refund
              </DropdownItem>
            </DropdownContent>
          </Dropdown>

          {/* Ticket filter */}
          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center gap-2 text-sm border border-white/10 px-3 py-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 4.5C1 4.10218 1.15804 3.72064 1.43934 3.43934C1.72064 3.15804 2.10218 3 2.5 3H13.5C13.8978 3 14.2794 3.15804 14.5607 3.43934C14.842 3.72064 15 4.10218 15 4.5V5.5C15 5.776 14.773 5.994 14.505 6.062C14.0743 6.1718 13.6925 6.42192 13.4198 6.77286C13.1472 7.1238 12.9991 7.55557 12.9991 8C12.9991 8.44443 13.1472 8.8762 13.4198 9.22714C13.6925 9.57808 14.0743 9.8282 14.505 9.938C14.773 10.006 15 10.224 15 10.5V11.5C15 11.8978 14.842 12.2794 14.5607 12.5607C14.2794 12.842 13.8978 13 13.5 13H2.5C2.10218 13 1.72064 12.842 1.43934 12.5607C1.15804 12.2794 1 11.8978 1 11.5V10.5C1 10.224 1.227 10.006 1.495 9.938C1.92565 9.8282 2.30747 9.57808 2.58016 9.22714C2.85285 8.8762 3.00088 8.44443 3.00088 8C3.00088 7.55557 2.85285 7.1238 2.58016 6.77286C2.30747 6.42192 1.92565 6.1718 1.495 6.062C1.227 5.994 1 5.776 1 5.5V4.5Z"
                    fill="white"
                    fillOpacity="0.5"
                  />
                </svg>
                {ticketFilter}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </DropdownTrigger>
            <DropdownContent
              align="left"
              className="w-48 bg-[#151515] border border-white/10 rounded-lg shadow-lg overflow-hidden"
            >
              <DropdownItem
                onClick={() => setTicketFilter("All tickets")}
                className="px-4 py-2 hover:bg-white/5 text-white"
              >
                All tickets
              </DropdownItem>
              {event?.tickets?.map((ticket, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => setTicketFilter(ticket.ticket_name)}
                  className="px-4 py-2 hover:bg-white/5 text-white"
                >
                  {ticket.ticket_name}
                </DropdownItem>
              ))}
            </DropdownContent>
          </Dropdown>
        </div>
        <div className="relative w-full @4xl:w-fit flex justify-end h-fit">
          <input
            type="text"
            placeholder="Search sales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/10 @4xl:w-[250px]"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>
      <div className="border rounded-xl h-fit border-white/10 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/70 [&_th]:font-medium border-b border-white/5 bg-white/5 [&>th]:min-w-[180px] last:[&>th]:min-w-fit">
                <th className="p-4 text-sm font-medium text-white/70 text-left">
                  Date
                </th>
                <th className="p-4 text-sm font-medium text-white/70 text-left">
                  Type
                </th>
                <th className="p-4 text-sm font-medium text-white/70 text-left">
                  Ticket
                </th>
                <th className="p-4 text-sm font-medium text-white/70 text-left">
                  Name
                </th>
                <th className="p-4 text-sm font-medium text-white/70 text-left">
                  Amount
                </th>
                <th className="p-4 text-sm font-medium text-white/70 text-left">
                  Status
                </th>
                <th className="p-4 text-sm font-medium text-white/70 text-left">
                  <Ellipsis />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {
                loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center p-4 text-white/50"
                    >
                      <Spin size="small" />
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredSalesHistory.slice().reverse().map((payout, index) => (
                      <tr key={index} className="hover:bg-white/[0.01]">
                        <td className="p-4">{formatDate(payout.date)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 capitalize">
                            {payout.refund === 'true' ? saleTypesIcons['refund'] : saleTypesIcons['sale']}
                            {payout.refund === 'true' ? "Refund" : "Sale"}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 capitalize">
                            {/* {ticketTypesIcons[payout.ticket]} */}
                            {payout?.tickets?.ticket_name} x {payout.count}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span>{payout.firstName}</span>
                            <span className="text-white/50 text-xs">
                              {payout.email}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`p-4 ${payout.amount < 0 ? "text-white/50" : ""
                            }`}
                        >
                          {payout.amount < 0
                            ? `-$${(Math.abs((payout.amount / 100) - 0.89) / 1.09).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`
                            : `$${(Math.abs((payout.amount / 100) - 0.89) / 1.09).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}`}
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-2 capitalize">
                            {payout.refund === 'true' ? statusIcons['refunded'] : statusIcons['completed']}
                            {payout.refund === 'true' ? "Refunded" : "Completed"}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="hover:bg-white/10 p-1 rounded">
                            <MoreHorizontal className="w-4 h-4 text-white/50" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </>
                )
              }

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}