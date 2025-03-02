import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, ArrowLeft } from "lucide-react";
import DateModal from "../../components/modals/DateModal";
import TimeModal from "../../components/TimeModal";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "../../components/ui/Dropdown";
import ImageCropper from "../../components/ImageCropper";

const ticketTypes = [
  {
    value: "default",
    label: "Default",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M8.372 1.34876C8.2587 1.28404 8.13048 1.25 8 1.25C7.86952 1.25 7.7413 1.28404 7.628 1.34876L2.818 4.09676L8 7.13076L13.182 4.09676L8.372 1.34876ZM14 5.35676L8.75 8.42976V14.4348L13.622 11.6508C13.7368 11.5852 13.8322 11.4904 13.8986 11.3761C13.965 11.2618 14 11.132 14 10.9998V5.35676ZM7.25 14.4348V8.42976L2 5.35676V10.9998C2 11.2698 2.144 11.5178 2.378 11.6508L7.25 14.4348Z"
          fill="white"
          fillOpacity="0.4"
        />
      </svg>
    ),
  },
  {
    value: "star",
    label: "Star",
    icon: (
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
          d="M8.00002 1.75C8.14809 1.7501 8.29282 1.79403 8.41596 1.87624C8.53911 1.95846 8.63516 2.07529 8.69202 2.212L10.102 5.605L13.766 5.898C13.9137 5.90988 14.0545 5.9652 14.1707 6.05699C14.2869 6.14878 14.3734 6.27293 14.4192 6.41379C14.4649 6.55464 14.468 6.7059 14.4279 6.84849C14.3879 6.99108 14.3065 7.11861 14.194 7.215L11.403 9.605L12.256 13.18C12.2903 13.324 12.2812 13.475 12.2298 13.6138C12.1784 13.7527 12.0871 13.8733 11.9673 13.9603C11.8476 14.0473 11.7047 14.097 11.5568 14.103C11.4088 14.109 11.2624 14.0711 11.136 13.994L7.99802 12.08L4.86302 13.995C4.7366 14.0721 4.5902 14.11 4.44227 14.104C4.29433 14.098 4.15148 14.0483 4.03172 13.9613C3.91195 13.8743 3.82063 13.7537 3.76925 13.6149C3.71788 13.476 3.70875 13.325 3.74302 13.181L4.59502 9.607L1.80502 7.217C1.69227 7.12074 1.61058 6.99323 1.57026 6.85056C1.52994 6.7079 1.53281 6.55648 1.5785 6.41545C1.62419 6.27441 1.71066 6.15008 1.82698 6.05816C1.94329 5.96624 2.08424 5.91086 2.23202 5.899L5.89502 5.606L7.30502 2.213C7.36192 2.07563 7.45837 1.95826 7.58212 1.87582C7.70587 1.79338 7.85133 1.74959 8.00002 1.75C8.14809 1.7501 8.29282 1.79403 8.41596 1.87624C8.53911 1.95846 8.63516 2.07529 8.69202 2.212L10.102 5.605L13.766 5.898C13.9137 5.90988 14.0545 5.9652 14.1707 6.05699C14.2869 6.14878 14.3734 6.27293 14.4192 6.41379C14.4649 6.55464 14.468 6.7059 14.4279 6.84849C14.3879 6.99108 14.3065 7.11861 14.194 7.215L11.403 9.605L12.256 13.18C12.2903 13.324 12.2812 13.475 12.2298 13.6138C12.1784 13.7527 12.0871 13.8733 11.9673 13.9603C11.8476 14.0473 11.7047 14.097 11.5568 14.103C11.4088 14.109 11.2624 14.0711 11.136 13.994L7.99802 12.08L4.86302 13.995C4.7366 14.0721 4.5902 14.11 4.44227 14.104C4.29433 14.098 4.15148 14.0483 4.03172 13.9613C3.91195 13.8743 3.82063 13.7537 3.76925 13.6149C3.71788 13.476 3.70875 13.325 3.74302 13.181L4.59502 9.607L1.80502 7.217C1.69227 7.12074 1.61058 6.99323 1.57026 6.85056C1.52994 6.7079 1.53281 6.55648 1.5785 6.41545C1.62419 6.27441 1.71066 6.15008 1.82698 6.05816C1.94329 5.96624 2.08424 5.91086 2.23202 5.899L5.89502 5.606L7.30502 2.213C7.36192 2.07563 7.45837 1.95826 7.58212 1.87582C7.70587 1.79338 7.85133 1.74959 8.00002 1.75C7.86952 1.75 7.7413 1.78404 7.628 1.84876L2.818 4.59676L8 7.63076L13.182 4.59676L8.372 1.84876ZM14 5.35676L8.75 8.42976V14.4348L13.622 11.6508C13.7368 11.5852 13.8322 11.4904 13.8986 11.3761C13.965 11.2618 14 11.132 14 10.9998V5.35676ZM7.25 14.4348V8.42976L2 5.35676V10.9998C2 11.2698 2.144 11.5178 2.378 11.6508L7.25 14.4348Z"
          fill="white"
          fillOpacity="0.4"
        />
      </svg>
    ),
  },
  {
    value: "smile",
    label: "Smile",
    icon: (
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
          d="M15 8C15 9.85652 14.2625 11.637 12.9497 12.9497C11.637 14.2625 9.85652 15 8 15C6.14348 15 4.36301 14.2625 3.05025 12.9497C1.7375 11.637 1 9.85652 1 8C1 6.14348 1.7375 4.36301 3.05025 3.05025C4.36301 1.7375 6.14348 1 8 1C9.85652 1 11.637 1.7375 12.9497 3.05025C14.2625 4.36301 15 6.14348 15 8ZM6 8C6.552 8 7 7.328 7 6.5C7 5.672 6.552 5 6 5C5.448 5 5 5.672 5 6.5C5 7.328 5.448 8 6 8ZM11 6.5C11 7.328 10.552 8 10 8C9.448 8 9 7.328 9 6.5C9 5.672 9.448 5 10 5C10.552 5 11 5.672 11 6.5ZM11.005 10.745C10.8644 10.6045 10.6738 10.5257 10.475 10.5257C10.2762 10.5257 10.0856 10.6045 9.945 10.745C9.68962 11.0005 9.38641 11.2032 9.05268 11.3415C8.71895 11.4797 8.36124 11.5509 8 11.5509C7.63876 11.5509 7.28105 11.4797 6.94732 11.3415C6.61359 11.2032 6.31038 11.0005 6.055 10.745C5.91282 10.6125 5.72478 10.5404 5.53048 10.5438C5.33618 10.5473 5.15079 10.626 5.01338 10.7634C4.87597 10.9008 4.79725 11.0862 4.79383 11.2805C4.7904 11.4748 4.86252 11.6628 4.995 11.805C5.79201 12.6019 6.87293 13.0496 8 13.0496C9.12707 13.0496 10.208 12.6019 11.005 11.805C11.1455 11.6644 11.2243 11.4738 11.2243 11.275C11.2243 11.0762 11.1455 10.8856 11.005 10.745Z"
          fill="#F97316"
        />
      </svg>
    ),
  },
  {
    value: "sparkles",
    label: "Sparkles",
    icon: (
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
          d="M5.00037 4C5.17606 3.99998 5.34617 4.06164 5.48104 4.17422C5.61591 4.28679 5.70699 4.44315 5.73837 4.616L5.99037 6.004C6.03588 6.25408 6.15655 6.48434 6.33629 6.66408C6.51603 6.84382 6.74629 6.96449 6.99637 7.01L8.38437 7.262C8.5573 7.29331 8.71374 7.38435 8.82639 7.51923C8.93904 7.65411 9.00075 7.82427 9.00075 8C9.00075 8.17573 8.93904 8.34589 8.82639 8.48077C8.71374 8.61565 8.5573 8.70669 8.38437 8.738L6.99637 8.99C6.74629 9.03551 6.51603 9.15618 6.33629 9.33592C6.15655 9.51566 6.03588 9.74592 5.99037 9.996L5.73837 11.384C5.70706 11.5569 5.61602 11.7134 5.48114 11.826C5.34626 11.9387 5.17611 12.0004 5.00037 12.0004C4.82464 12.0004 4.65448 11.9387 4.5196 11.826C4.38472 11.7134 4.29368 11.5569 4.26237 11.384L4.01037 9.996C3.96486 9.74592 3.84419 9.51566 3.66446 9.33592C3.48472 9.15618 3.25445 9.03551 3.00437 8.99L1.61637 8.738C1.44345 8.70669 1.28701 8.61565 1.17436 8.48077C1.06171 8.34589 1 8.17573 1 8C1 7.82427 1.06171 7.65411 1.17436 7.51923C1.28701 7.38435 1.44345 7.29331 1.61637 7.262L3.00437 7.01C3.25445 6.96449 3.48472 6.84382 3.66446 6.66408C3.84419 6.48434 3.96486 6.25408 4.01037 6.004L4.26237 4.616C4.29376 4.44315 4.38484 4.28679 4.51971 4.17422C4.65458 4.06164 4.82469 3.99998 5.00037 4ZM12.0004 1C12.1633 1.00003 12.3219 1.05314 12.4519 1.1513C12.582 1.24945 12.6766 1.3873 12.7214 1.544L12.9164 2.226C13.0344 2.641 13.3594 2.966 13.7744 3.084L14.4564 3.279C14.613 3.32386 14.7507 3.41848 14.8488 3.54856C14.9468 3.67864 14.9998 3.83711 14.9998 4C14.9998 4.16289 14.9468 4.32136 14.8488 4.45144C14.7507 4.58152 14.613 4.67614 14.4564 4.721L13.7744 4.916C13.5703 4.97439 13.3844 5.0838 13.2343 5.23391C13.0842 5.38402 12.9748 5.56989 12.9164 5.774L12.7214 6.456C12.6765 6.6126 12.5819 6.75033 12.4518 6.84838C12.3217 6.94643 12.1633 6.99946 12.0004 6.99946C11.8375 6.99946 11.679 6.94643 11.5489 6.84838C11.4189 6.75033 11.3242 6.6126 11.2794 6.456L11.0844 5.774C11.026 5.56989 10.9166 5.38402 10.7665 5.23391C10.6164 5.0838 10.4305 4.97439 10.2264 4.916L9.54437 4.721C9.38778 4.67614 9.25005 4.58152 9.152 4.45144C9.05395 4.32136 9.00091 4.16289 9.00091 4C9.00091 3.83711 9.05395 3.67864 9.152 3.54856C9.25005 3.41848 9.38778 3.32386 9.54437 3.279L10.2264 3.084C10.4305 3.02561 10.6164 2.9162 10.7665 2.76609C10.9166 2.61598 11.026 2.43011 11.0844 2.226L11.2794 1.544C11.3241 1.3873 11.4187 1.24945 11.5488 1.1513C11.6789 1.05314 11.8374 1.00003 12.0004 1ZM10.0004 11C10.1677 10.9999 10.3302 11.0558 10.4621 11.1587C10.5941 11.2616 10.6878 11.4057 10.7284 11.568C10.771 11.7381 10.8589 11.8935 10.9829 12.0174C11.1069 12.1414 11.2623 12.2294 11.4324 12.272C11.595 12.3123 11.7395 12.4059 11.8427 12.5378C11.946 12.6697 12.0021 12.8325 12.0021 13C12.0021 13.1675 11.946 13.3303 11.8427 13.4622C11.7395 13.5941 11.595 13.6877 11.4324 13.728C11.2623 13.7706 11.1069 13.8586 10.9829 13.9826C10.8589 14.1065 10.771 14.2619 10.7284 14.432C10.6881 14.5946 10.5945 14.7391 10.4626 14.8423C10.3306 14.9456 10.1679 15.0017 10.0004 15.0017C9.83283 15.0017 9.67012 14.9456 9.53817 14.8423C9.40623 14.7391 9.31266 14.5946 9.27237 14.432C9.2298 14.2619 9.14181 14.1065 9.01782 13.9826C8.89383 13.8586 8.73848 13.7706 8.56837 13.728C8.40575 13.6877 8.26129 13.5941 8.15804 13.4622C8.05479 13.3303 7.9987 13.1675 7.9987 13C7.9987 12.8325 8.05479 12.6697 8.15804 12.5378C8.26129 12.4059 8.40575 12.3123 8.56837 12.272C8.73848 12.2294 8.89383 12.1414 9.01782 12.0174C9.14181 11.8935 9.2298 11.7381 9.27237 11.568C9.31298 11.4057 9.40669 11.2616 9.5386 11.1587C9.67052 11.0558 9.83306 10.9999 10.0004 11Z"
          fill="#A855F7"
        />
      </svg>
    ),
  },
  {
    value: "trophy",
    label: "Trophy",
    icon: (
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
          d="M11.9997 1.6902C12.0005 1.56833 11.9562 1.45047 11.8754 1.35929C11.7945 1.2681 11.6828 1.21001 11.5617 1.1962C9.1943 0.933949 6.80515 0.933949 4.43772 1.1962C4.31681 1.20999 4.20524 1.26794 4.12442 1.35891C4.04359 1.44989 3.99919 1.5675 3.99972 1.6892V2.2562C3.18872 2.3602 2.38772 2.4962 1.59672 2.6622C1.43172 2.69699 1.28325 2.78638 1.17529 2.91593C1.06734 3.04547 1.00619 3.20763 1.00172 3.3762C0.968833 4.56509 1.40794 5.71865 2.22306 6.58474C3.03818 7.45083 4.16303 7.95901 5.35172 7.9982C5.82408 8.41638 6.38886 8.71659 6.99972 8.8742V10.0002H5.99972C5.73451 10.0002 5.48015 10.1056 5.29262 10.2931C5.10508 10.4806 4.99972 10.735 4.99972 11.0002V13.0002H4.33272C3.59672 13.0002 2.99972 13.5972 2.99972 14.3332C2.99972 14.7012 3.29772 15.0002 3.66672 15.0002H12.3327C12.5096 15.0002 12.6793 14.9299 12.8044 14.8048C12.9295 14.6798 12.9997 14.5101 12.9997 14.3332C12.9997 13.5972 12.4027 13.0002 11.6667 13.0002H10.9997V11.0002C10.9997 10.735 10.8944 10.4806 10.7068 10.2931C10.5193 10.1056 10.2649 10.0002 9.99972 10.0002H8.99972V8.8742C9.61094 8.71674 10.1761 8.41652 10.6487 7.9982C11.8374 7.95901 12.9623 7.45083 13.7774 6.58474C14.5925 5.71865 15.0316 4.56509 14.9987 3.3762C14.9942 3.20749 14.9329 3.04523 14.8248 2.91566C14.7166 2.78609 14.5679 2.69679 14.4027 2.6622C13.6074 2.49532 12.8058 2.35988 11.9997 2.2562V1.6892V1.6902ZM3.99972 3.7682C3.50972 3.8342 3.02372 3.9132 2.54172 4.0032C2.62188 4.47237 2.81238 4.91577 3.09751 5.29688C3.38264 5.67798 3.75426 5.98588 4.18172 6.1952C4.06086 5.80839 3.99949 5.40545 3.99972 5.0002V3.7692V3.7682ZM11.9997 3.7682C12.4897 3.8342 12.9757 3.9132 13.4577 4.0032C13.3776 4.47237 13.1871 4.91577 12.9019 5.29688C12.6168 5.67798 12.2452 5.98588 11.8177 6.1952C11.9357 5.8182 11.9997 5.4162 11.9997 5.0002V3.7692V3.7682Z"
          fill="#F9C816"
        />
      </svg>
    ),
  },
  {
    value: "rocket",
    label: "Rocket",
    icon: (
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
          d="M6.333 4.478C5.72963 4.26474 5.08391 4.19936 4.45004 4.28734C3.81617 4.37533 3.21266 4.61412 2.69019 4.98366C2.16772 5.3532 1.74154 5.8427 1.44744 6.41106C1.15334 6.97942 0.999897 7.61005 1 8.25C1 8.664 1.336 9 1.75 9H5.072C5.644 9.71 6.291 10.356 7 10.928V14.25C7 14.664 7.336 15 7.75 15C8.38995 15.0001 9.02058 14.8467 9.58894 14.5526C10.1573 14.2585 10.6468 13.8323 11.0163 13.3098C11.3859 12.7873 11.6247 12.1838 11.7127 11.55C11.8006 10.9161 11.7353 10.2704 11.522 9.667C12.6197 8.66118 13.4958 7.43778 14.0946 6.07471C14.6934 4.71164 15.0018 3.2388 15 1.75C15 1.55109 14.921 1.36032 14.7803 1.21967C14.6397 1.07902 14.4489 1 14.25 1C11.117 1 8.297 2.34 6.333 4.478ZM12 5.5C12 5.89782 11.842 6.27936 11.5607 6.56066C11.2794 6.84196 10.8978 7 10.5 7C10.1022 7 9.72064 6.84196 9.43934 6.56066C9.15804 6.27936 9 5.89782 9 5.5C9 5.10218 9.15804 4.72064 9.43934 4.43934C9.72064 4.15804 10.1022 4 10.5 4C10.8978 4 11.2794 4.15804 11.5607 4.43934C11.842 4.72064 12 5.10218 12 5.5Z"
          fill="#34B2DA"
        />
        <path
          d="M3.90248 10.6819C3.95166 10.5956 3.98321 10.5003 3.99528 10.4017C4.00736 10.3031 3.99973 10.2031 3.97284 10.1075C3.94594 10.0119 3.90031 9.92252 3.83861 9.84467C3.7769 9.76682 3.70034 9.70201 3.61338 9.65399C3.52642 9.60597 3.43078 9.57571 3.33203 9.56495C3.23327 9.5542 3.13336 9.56317 3.0381 9.59135C2.94285 9.61953 2.85413 9.66635 2.77712 9.7291C2.70011 9.79185 2.63632 9.86927 2.58948 9.95687C2.02614 10.9814 1.85921 12.1773 2.12048 13.3169C2.15209 13.4542 2.22176 13.5799 2.32152 13.6795C2.42127 13.7791 2.54706 13.8485 2.68448 13.8799C3.82387 14.141 5.0195 13.9737 6.04348 13.4099C6.13344 13.3644 6.21331 13.3012 6.27832 13.2242C6.34332 13.1471 6.39213 13.0578 6.42181 12.9614C6.4515 12.8651 6.46146 12.7637 6.4511 12.6635C6.44074 12.5632 6.41027 12.466 6.36151 12.3778C6.31276 12.2896 6.24671 12.2121 6.16733 12.1499C6.08794 12.0878 5.99685 12.0423 5.89948 12.0162C5.80212 11.9901 5.70049 11.9838 5.60066 11.9979C5.50084 12.0119 5.40486 12.0459 5.31848 12.0979C4.76643 12.4027 4.13724 12.5393 3.50848 12.4909C3.4604 11.862 3.59736 11.2328 3.90248 10.6809V10.6819Z"
          fill="#34B2DA"
        />
      </svg>
    ),
  },
];

export default function TicketEvent() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [eventName, setEventName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageFile, setTempImageFile] = useState(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isEventTimeModalOpen, setIsEventTimeModalOpen] = useState(false);
  const [isDoorsTimeModalOpen, setIsDoorsTimeModalOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [eventTime, setEventTime] = useState("");
  const [doorsOpenTime, setDoorsOpenTime] = useState("");

  // Location states
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");

  // Event details states
  const [eventDescription, setEventDescription] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [showAttendees, setShowAttendees] = useState(false);

  // Ticket form states
  const [ticketName, setTicketName] = useState("");
  const [ticketType, setTicketType] = useState(ticketTypes[0].value);
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [ticketSaleStartDate, setTicketSaleStartDate] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [ticketSaleEndDate, setTicketSaleEndDate] = useState("");
  const [minPurchase, setMinPurchase] = useState("1");
  const [maxPurchase, setMaxPurchase] = useState("10");

  const [isTicketStartDateModalOpen, setIsTicketStartDateModalOpen] =
    useState(false);
  const [isTicketEndDateModalOpen, setIsTicketEndDateModalOpen] =
    useState(false);
  const [ticketStartDate, setTicketStartDate] = useState(null);
  const [ticketEndDate, setTicketEndDate] = useState(null);

  const categories = [
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="none"
        >
          <path
            d="M11.9995 0.916686C11.9996 0.806316 11.9752 0.6973 11.9283 0.597417C11.8813 0.497534 11.8129 0.409245 11.7279 0.338851C11.6429 0.268457 11.5434 0.217693 11.4365 0.19018C11.3296 0.162667 11.218 0.159084 11.1095 0.179686L3.60754 1.60969C3.43613 1.64226 3.28143 1.73357 3.17009 1.86791C3.05875 2.00225 2.99773 2.17121 2.99754 2.34569V4.84569C2.99754 4.86369 2.99754 4.88169 2.99954 4.89969V8.89669C2.99969 9.12957 2.91856 9.3552 2.77013 9.53465C2.62171 9.71411 2.41531 9.83614 2.18654 9.87969L1.60654 9.98969C1.09122 10.0879 0.63605 10.3869 0.341149 10.8208C0.046248 11.2546 -0.0642222 11.7879 0.0340405 12.3032C0.132303 12.8185 0.43125 13.2737 0.865115 13.5686C1.29898 13.8635 1.83222 13.9739 2.34754 13.8757L2.95054 13.7607C3.85054 13.5897 4.50054 12.8037 4.50054 11.8877V10.3447L4.49954 10.3017V5.46669L10.4995 4.32369V7.46969C10.4995 7.7024 10.4182 7.92779 10.2698 8.10704C10.1214 8.28629 9.91514 8.40817 9.68654 8.45169L9.10254 8.56269C8.59124 8.66496 8.14101 8.96499 7.84978 9.39752C7.55856 9.83004 7.4499 10.3601 7.54744 10.8723C7.64498 11.3845 7.94083 11.8375 8.37064 12.1327C8.80045 12.4279 9.32944 12.5415 9.84254 12.4487L10.1685 12.3867C10.6836 12.2887 11.1484 12.014 11.4826 11.61C11.8169 11.206 11.9997 10.698 11.9995 10.1737V0.916686Z"
            fill="#F43F5E"
          />
        </svg>
      ),
      name: "Music",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            d="M12.6124 1.42376C12.9076 1.22597 13.2624 1.13677 13.6161 1.17135C13.9697 1.20594 14.3005 1.36217 14.5518 1.6134C14.8032 1.86463 14.9596 2.19529 14.9943 2.54896C15.0291 2.90263 14.94 3.25741 14.7424 3.55276L12.8374 6.40876C11.9653 7.71696 10.7271 8.7392 9.27738 9.34776C9.07833 8.77933 8.75383 8.26303 8.32797 7.83716C7.9021 7.4113 7.3858 7.0868 6.81738 6.88776C7.42621 5.43794 8.4488 4.19969 9.75738 3.32776L12.6124 1.42376ZM5.49938 8.16576C4.83634 8.16576 4.20045 8.42915 3.73161 8.89799C3.26277 9.36683 2.99938 10.0027 2.99938 10.6658C2.9995 10.7488 2.97892 10.8306 2.93949 10.9038C2.90006 10.9769 2.84303 11.0391 2.77355 11.0846C2.70407 11.1302 2.62433 11.1577 2.54154 11.1647C2.45875 11.1717 2.37553 11.158 2.29938 11.1248C2.16009 11.0636 2.00549 11.0462 1.8561 11.075C1.70671 11.1037 1.56959 11.1772 1.46295 11.2857C1.3563 11.3942 1.28517 11.5325 1.25899 11.6824C1.23281 11.8323 1.25283 11.9865 1.31638 12.1248C1.64872 12.8515 2.21978 13.4427 2.93465 13.8C3.64951 14.1573 4.46511 14.2592 5.2459 14.0887C6.02668 13.9183 6.72562 13.4857 7.22654 12.863C7.72745 12.2403 8.00017 11.4649 7.99938 10.6658C7.99938 10.0027 7.73599 9.36683 7.26714 8.89799C6.7983 8.42915 6.16242 8.16576 5.49938 8.16576Z"
            fill="#A3E635"
          />
        </svg>
      ),
      name: "Arts & Culture",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.07405 1.11162C7.43153 1.57461 6.90837 2.18379 6.54775 2.88886C6.18712 3.59394 5.99939 4.37468 6.00005 5.16662V5.19862C6.00405 5.79862 6.11405 6.37462 6.31105 6.90762C6.47105 7.33562 6.10705 7.81762 5.70105 7.60762C4.94648 7.21573 4.30374 6.63872 3.83305 5.93062C3.63105 5.62662 3.18505 5.56762 2.98505 5.87262C2.32554 6.8767 1.98262 8.05563 2.00068 9.25679C2.01874 10.458 2.39694 11.626 3.08634 12.6098C3.77573 13.5936 4.74457 14.3478 5.86742 14.7748C6.99028 15.2018 8.21545 15.2819 9.38434 15.0047C10.5532 14.7275 11.612 14.1059 12.4236 13.2202C13.2352 12.3345 13.7623 11.2256 13.9365 10.037C14.1108 8.84844 13.9243 7.6349 13.4011 6.55351C12.8779 5.47212 12.0422 4.57268 11.002 3.97162L10.998 3.96462C9.99408 3.38634 9.22317 2.47609 8.81805 1.39062C8.70205 1.08062 8.34105 0.919623 8.07405 1.11162ZM8.85405 7.28962C9.32568 7.42949 9.7557 7.68316 10.1062 8.02829C10.4568 8.37342 10.7171 8.79944 10.8643 9.26884C11.0115 9.73824 11.0411 10.2366 10.9503 10.7201C10.8596 11.2036 10.6515 11.6574 10.3441 12.0415C10.0368 12.4257 9.63978 12.7284 9.18797 12.923C8.73616 13.1176 8.24344 13.1981 7.75318 13.1575C7.26292 13.1169 6.79016 12.9565 6.37651 12.6902C5.96286 12.4239 5.62101 12.0601 5.38105 11.6306C5.17605 11.2656 5.59605 10.9366 6.00105 11.0406C6.61425 11.1984 7.25611 11.2087 7.87405 11.0706C8.16205 11.0056 8.28705 10.6846 8.19505 10.4046C8.06525 10.0045 7.99944 9.58631 8.00005 9.16562C8.00005 8.58062 8.12605 8.02562 8.35105 7.52462C8.39194 7.43096 8.46559 7.35542 8.55818 7.31216C8.65078 7.2689 8.75597 7.26089 8.85405 7.28962Z"
            fill="#F97316"
          />
        </svg>
      ),
      name: "Sport",
    },
    {
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
        >
          <path
            d="M14.4379 10.3143C14.6279 9.88934 14.1169 9.52734 13.6899 9.71334C12.6773 10.1536 11.5557 10.279 10.4709 10.073C9.38608 9.86709 8.38839 9.3394 7.60762 8.55864C6.82686 7.77787 6.29917 6.78018 6.09323 5.69538C5.88728 4.61059 6.01262 3.48892 6.45292 2.47634C6.63892 2.04934 6.27692 1.53834 5.85292 1.72834C4.89004 2.1578 4.04606 2.81499 3.39374 3.64327C2.74142 4.47155 2.30033 5.44605 2.10851 6.48276C1.91668 7.51947 1.97988 8.58728 2.29265 9.59413C2.60541 10.601 3.15837 11.5167 3.90383 12.2622C4.6493 13.0078 5.5649 13.5608 6.57172 13.8737C7.57853 14.1866 8.64633 14.2499 9.68306 14.0582C10.7198 13.8665 11.6944 13.4255 12.5227 12.7733C13.3511 12.1211 14.0084 11.2772 14.4379 10.3143Z"
            fill="#A855F7"
          />
        </svg>
      ),
      name: "Nightlife",
    },
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTempImageFile(file);
      setIsCropperOpen(true);
    }
  };

  const handleCropComplete = ({
    croppedImage,
    fullImage,
    previewUrl,
    dimensions,
  }) => {
    console.log("Received cropped image:", previewUrl);
    console.log("Dimensions:", dimensions);

    setImageFile(croppedImage);
    setOriginalImage(fullImage);
    setImagePreview(previewUrl);

    // If you're storing the image in a form or state, make sure it's using the correct URL
    // For example, if you're using a form library like Formik or React Hook Form:
    // form.setValue('eventImage', previewUrl);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setOriginalImage(null);
  };

  // Function to get both images for backend upload
  const getImagesForUpload = () => {
    return {
      croppedImage: imageFile,
      originalImage: originalImage,
    };
  };

  // Form steps content
  const formSteps = [
    {
      id: 1,
      title: "Basic info",
      description: "Let's start with the basic information about your event",
      fields: (
        <div className="w-full">
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Event name
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="After Hours, Electric Dreams, etc."
              className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white placeholder:text-white/30 placeholder:text-sm"
            />
          </div>
          <div className="w-full mt-4">
            <label className="block text-sm font-medium text-white mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center justify-between gap-3 text-white p-2.5 rounded-lg border ${
                    selectedCategory?.name === category.name
                      ? "border-[#34B2DA]"
                      : "border-white/5"
                  }`}
                >
                  <p className="text-sm font-medium flex items-center gap-2">
                    {" "}
                    <span>{category.icon}</span> {category.name}
                  </p>

                  <div className="size-4 rounded-full bg-[#34B2DA] flex items-center justify-center">
                    <Check className="size-3 text-black" />
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="w-full mt-4">
            <label className="block text-sm font-medium text-white mb-3">
              Upload cover flyer
            </label>
            <div className="relative p-6 rounded-lg text-center cursor-pointer border-2 border-dashed border-white/5 min-h-[200px] flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              {!imageFile ? (
                <label
                  htmlFor="image-upload"
                  className=" flex flex-col items-center justify-center "
                >
                  <p className="text-white/60 text-sm">
                    Click or drag to upload
                  </p>
                  <p className="text-white/40 text-xs mt-1">
                    Recommended size: 1200x630px • PNG or JPG
                  </p>
                </label>
              ) : (
                <div className="">
                  <div className="flex items-center justify-center h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-contain border border-white/[0.03] rounded-lg"
                    />
                  </div>
                  <div className="p-4 grid gap-5 items-center justify-between">
                    <div className="flex items-center justify-center gap-3">
                      <div>
                        <p className="text-white text-sm font-medium truncate max-w-[200px]">
                          {imageFile.name}
                        </p>
                        <p className="text-white/40 text-xs text-center font-semibold">
                          {(imageFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeImage}
                      className="px-3 py-1.5 border border-white/5 rounded-full text-white/60 text-sm hover:bg-white/5 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "When is your event?",
      description: "Set the date and time details for your event",
      fields: (
        <div className="w-full space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Choose event date
            </label>
            <button
              onClick={() => setIsDateModalOpen(true)}
              className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white/60 text-sm text-left flex items-center justify-between"
            >
              <span>
                {startDate ? startDate.toLocaleDateString() : "Click to select"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="white"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Enter event time
            </label>
            <button
              onClick={() => setIsEventTimeModalOpen(true)}
              className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white/60 text-sm text-left flex items-center justify-between"
            >
              <span>{eventTime || "Click to select"}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="white"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Doors open
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDoorsTimeModalOpen(true)}
                className="w-full bg-transparent border border-white/5 rounded-lg px-4 py-2.5 h-10 text-white/60 text-sm text-left flex items-center justify-between"
              >
                <span>{doorsOpenTime || "Click to select"}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="white"
                    strokeOpacity="0.6"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <p className="text-white/30 text-xs mt-1">
                When can attendees start arriving
              </p>
            </div>
          </div>

          <DateModal
            isOpen={isDateModalOpen}
            onClose={() => setIsDateModalOpen(false)}
            onDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />

          <TimeModal
            isOpen={isEventTimeModalOpen}
            onClose={() => setIsEventTimeModalOpen(false)}
            onTimeChange={(time) => setEventTime(time)}
          />

          <TimeModal
            isOpen={isDoorsTimeModalOpen}
            onClose={() => setIsDoorsTimeModalOpen(false)}
            onTimeChange={(time) => setDoorsOpenTime(time)}
          />
        </div>
      ),
    },
    {
      id: 3,
      title: "Location",
      description: "Where is your event taking place?",
      fields: (
        <div className="w-full">
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Venue name
            </label>
            <input
              type="text"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder="Enter venue name"
              className="w-full bg-transparent h-10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
            />
          </div>
          <div className="w-full mt-4">
            <label className="block text-sm font-medium text-white mb-3">
              Address
            </label>
            <input
              type="text"
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
              placeholder="Enter address"
              className="w-full bg-transparent h-10 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
            />
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: "Tell us more about your event",
      description: "Add description and manage event settings",
      fields: (
        <div className="w-full space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Event description
            </label>
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Tell attendees what to expect"
              className="w-full h-[120px] bg-transparent border border-white/5 rounded-lg px-4 py-3 text-white placeholder:text-white/30 resize-none placeholder:text-sm"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={eventAddress}
                onChange={(e) => setEventAddress(e.target.value)}
                placeholder="Enter address then choose from the list"
                className="w-full h-10 bg-transparent border border-white/5 rounded-lg pl-9 pr-4 py-2.5 text-white placeholder:text-white/30 placeholder:text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 8.5C9.10457 8.5 10 7.60457 10 6.5C10 5.39543 9.10457 4.5 8 4.5C6.89543 4.5 6 5.39543 6 6.5C6 7.60457 6.89543 8.5 8 8.5Z"
                  stroke="white"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 14C10 11.5 12 9.14621 12 6.5C12 3.85379 10.2091 2 8 2C5.79086 2 4 3.85379 4 6.5C4 9.14621 6 11.5 8 14Z"
                  stroke="white"
                  strokeOpacity="0.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="showAttendees"
              checked={showAttendees}
              onChange={(e) => setShowAttendees(e.target.checked)}
              className="size-4 rounded bg-transparent border-white/10"
            />
            <label htmlFor="showAttendees" className="text-sm text-white">
              Show attendees on event page
            </label>
          </div>
          <p className="text-white/30 text-xs">
            Let people see who&apos;s attending your event
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: "Tickets",
      description: "Set up your ticket types and pricing",
      fields: (
        <div className="w-full space-y-10">
          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Ticket name
            </label>
            <input
              type="text"
              value={ticketName}
              onChange={(e) => setTicketName(e.target.value)}
              placeholder="After Hours, Electric Queens, etc."
              className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Ticket type
            </label>
            <Dropdown>
              <DropdownTrigger>
                <button className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>
                      {
                        ticketTypes.find((type) => type.value === ticketType)
                          ?.icon
                      }
                    </span>
                    <span>
                      {ticketTypes.find((type) => type.value === ticketType)
                        ?.label || "Select ticket type"}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 6L8 10L12 6"
                      stroke="white"
                      strokeOpacity="0.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </DropdownTrigger>
              <DropdownContent className="bg-[#1A1A1A] border border-white/10 rounded-lg shadow-lg w-full">
                {ticketTypes.map((type) => (
                  <DropdownItem
                    key={type.value}
                    onClick={() => setTicketType(type.value)}
                    className={`px-4 py-2 hover:bg-white/5 flex items-center gap-3 ${
                      ticketType === type.value ? "bg-white/5" : ""
                    }`}
                  >
                    <span className="text-xl">{type.icon}</span>
                    <div>
                      <p className="text-white font-medium">{type.label}</p>
                    </div>
                  </DropdownItem>
                ))}
              </DropdownContent>
            </Dropdown>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Ticket price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                $
              </span>
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(e.target.value)}
                placeholder="50.00"
                className="w-full h-10 bg-transparent border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-white placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Ticket description
            </label>
            <textarea
              value={ticketDescription}
              onChange={(e) => setTicketDescription(e.target.value)}
              placeholder="e.g. Standard admission after 11 PM"
              className="w-full h-[80px] bg-transparent border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 resize-none"
            />
            <div className="flex items-center gap-2 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M8 5.5V8.5M8 11.5H8.01M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
                  stroke="#FF8A00"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#FF8A00] text-xs">Max 70 words</span>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-white mb-3">
              Total available ticket quantity
            </label>
            <input
              type="number"
              value={ticketQuantity}
              onChange={(e) => setTicketQuantity(e.target.value)}
              placeholder="0"
              className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Ticket sale start date
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsTicketStartDateModalOpen(true)}
                  className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-left text-white/60"
                >
                  {ticketStartDate
                    ? ticketStartDate.toLocaleDateString()
                    : "Select date"}
                </button>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeOpacity="0.3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <DateModal
                isOpen={isTicketStartDateModalOpen}
                onClose={() => setIsTicketStartDateModalOpen(false)}
                onDateChange={(startDate) => {
                  setTicketStartDate(startDate);
                  setTicketSaleStartDate(
                    startDate ? startDate.toLocaleDateString() : ""
                  );
                }}
                startDate={ticketStartDate}
                setStartDate={setTicketStartDate}
                endDate={ticketStartDate}
                setEndDate={setTicketStartDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Ticket sale end date
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsTicketEndDateModalOpen(true)}
                  className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-left text-white/60"
                >
                  {ticketEndDate
                    ? ticketEndDate.toLocaleDateString()
                    : "Select date"}
                </button>
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="white"
                    strokeOpacity="0.3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <DateModal
                isOpen={isTicketEndDateModalOpen}
                onClose={() => setIsTicketEndDateModalOpen(false)}
                onDateChange={(startDate) => {
                  setTicketEndDate(startDate);
                  setTicketSaleEndDate(
                    startDate ? startDate.toLocaleDateString() : ""
                  );
                }}
                startDate={ticketEndDate}
                setStartDate={setTicketEndDate}
                endDate={ticketEndDate}
                setEndDate={setTicketEndDate}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Min purchase power
              </label>
              <input
                type="number"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
                placeholder="1"
                className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Max purchase power
              </label>
              <input
                type="number"
                value={maxPurchase}
                onChange={(e) => setMaxPurchase(e.target.value)}
                placeholder="10"
                className="w-full h-10 bg-transparent border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const Header = () => (
    <div className="fixed top-0 left-0 right-0 bg-[#111111] border-b border-white/10 z-50">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M11.4476 14.0671C11.2063 14.6032 10.9064 15.1283 10.5469 15.5826C13.5301 14.5771 15.7261 11.8605 15.9679 8.59998H14.9059C13.61 8.59998 12.569 9.6344 12.3584 10.9131C12.1642 12.0918 11.8535 13.1651 11.4476 14.0671Z"
              fill="#34B2DA"
            />
            <path
              d="M9.09847 8.59998C10.4553 8.59998 11.5652 9.73192 11.316 11.0657C10.7747 13.9626 9.48934 15.9999 7.98984 15.9999C6.09247 15.9999 4.53794 12.7379 4.3999 8.59998H9.09847Z"
              fill="#34B2DA"
            />
            <path
              d="M12.3859 5.25936C12.5844 6.55002 13.6301 7.59924 14.936 7.59924H15.9802C15.8153 4.25014 13.5909 1.44261 10.5469 0.416626C10.9064 0.870919 11.2063 1.39598 11.4476 1.93211C11.8733 2.87812 12.1942 4.01254 12.3859 5.25936Z"
              fill="#34B2DA"
            />
          </svg>
          <span className="text-white font-semibold">Avenue</span>
        </Link>

        {/* Progress steps in the middle */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-[400px] mx-8">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div key={stepNumber} className="flex-1">
              <div
                className={`h-1 w-full rounded-full ${
                  stepNumber <= step ? "bg-[#34B2DA]" : "bg-white/10"
                }`}
              />
              <span
                className={`mt-1 text-xs ${
                  stepNumber <= step ? "text-white" : "text-white/40"
                } text-center block`}
              >
                {stepNumber === 1 && "Basic info"}
                {stepNumber === 2 && "Date"}
                {stepNumber === 3 && "Location"}
                {stepNumber === 4 && "Details"}
                {stepNumber === 5 && "Media"}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/organizer/create-ticket")}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="white"
              strokeWidth="1.67"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#111111] h-full w-full">
      <Header />
      {/* Image Cropper Dialog */}
      <ImageCropper
        open={isCropperOpen}
        onOpenChange={setIsCropperOpen}
        imageFile={tempImageFile}
        onCropComplete={handleCropComplete}
      />
      {/* Update the main container structure */}
      <div className="pt-16 flex flex-col md:flex-row bg-[#111111]">
        {/* Scrollable left side */}
        <div className="w-full order-2 md:order-1 md:w-1/2 min-h-[calc(100vh-64px)] overflow-y-auto flex flex-col items-center justify-center">
          <div className="p-8 max-w-xl mx-auto flex flex-col w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-white">
                {formSteps[step - 1].title}
              </h2>
              <p className="text-white/60 text-sm mt-1">
                {formSteps[step - 1].description}
              </p>
            </div>
            {formSteps[step - 1].fields}
            <div className="flex justify-between gap-5 mt-8 w-full">
              <button
                onClick={() => (step === 1 ? navigate(-1) : setStep(step - 1))}
                className={`size-10 flex-shrink-0 flex items-center justify-center rounded-full border border-white/10 text-white`}
              >
                <ArrowLeft className="size-5" />
              </button>
              <button
                onClick={() => {
                  // When moving to the next step, if we're on the image upload step,
                  // make sure we have the images ready for upload
                  if (step === 1 && imageFile) {
                    // Here we could use getImagesForUpload() to get both images
                    console.log(
                      "Images ready for upload:",
                      getImagesForUpload()
                    );
                  }
                  step < 5 && setStep(step + 1);
                }}
                className="px-4 py-2 w-full rounded-full h-10 bg-white font-semibold text-primary flex items-center justify-center gap-2"
                disabled={step === 5}
              >
                {step === 5 ? "Complete creating Event" : "Continue"}
              </button>
            </div>
          </div>
        </div>

        {/* Fixed right side preview */}
        <div className="w-full order-1 md:order-2 md:w-1/2 md:h-[calc(100vh-64px)] bg-[#141414] flex items-center justify-center p-8 md:sticky top-16">
          <div className="bg-white/[0.03] mx-auto rounded-3xl grid grid-rows-[1fr_70px] p-2">
            <div className="bg-[#0F0F0F] rounded-2xl flex items-center justify-center">
              {imagePreview ? (
                <div className="w-full h-full flex items-center justify-center rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Event cover"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="96"
                  height="96"
                  viewBox="0 0 96 96"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 24C12 20.8174 13.2643 17.7652 15.5147 15.5147C17.7652 13.2643 20.8174 12 24 12H72C75.1826 12 78.2348 13.2643 80.4853 15.5147C82.7357 17.7652 84 20.8174 84 24V72C84 75.1826 82.7357 78.2348 80.4853 80.4853C78.2348 82.7357 75.1826 84 72 84H24C20.8174 84 17.7652 82.7357 15.5147 80.4853C13.2643 78.2348 12 75.1826 12 72V24Z"
                    fill="white"
                    fillOpacity="0.1"
                  />
                </svg>
              )}
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="flex items-center gap-2 text-white/60 text-sm">
                {selectedCategory ? (
                  <>
                    <span className="flex items-center">
                      {selectedCategory.icon}
                    </span>
                    <span>{selectedCategory.name}</span>
                  </>
                ) : (
                  "Category"
                )}
              </div>
              <p className="text-white/60 text-sm">
                {startDate
                  ? `${startDate.toLocaleDateString()} at ${eventTime}`
                  : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="flex flex-col gap-2">
                <p className="text-white/60 text-sm">{eventName || "Name"}</p>
                <p className="text-white/60 text-sm">
                  {venueName || "Location"}
                </p>
              </div>
              <p className="text-white/60 text-2xl font-semibold">
                ${ticketPrice || "0"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
