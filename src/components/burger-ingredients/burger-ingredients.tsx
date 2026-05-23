import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { TIngredient, TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const allIngredients = useSelector((state) => state.ingredients.ingredients);

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSauceRef = useRef<HTMLHeadingElement>(null);

  const [bunsRef, bunsInView] = useInView({ threshold: 0 });
  const [mainsRef, mainsInView] = useInView({ threshold: 0 });
  const [saucesRef, saucesInView] = useInView({ threshold: 0 });

  const { buns, mains, sauces } = useMemo(
    () =>
      allIngredients.reduce(
        (
          acc: {
            buns: TIngredient[];
            mains: TIngredient[];
            sauces: TIngredient[];
          },
          ingredient: TIngredient
        ) => {
          if (ingredient.type === 'bun') {
            acc.buns.push(ingredient);
          }

          if (ingredient.type === 'main') {
            acc.mains.push(ingredient);
          }

          if (ingredient.type === 'sauce') {
            acc.sauces.push(ingredient);
          }

          return acc;
        },
        {
          buns: [],
          mains: [],
          sauces: []
        }
      ),
    [allIngredients]
  );

  useEffect(() => {
    if (bunsInView) {
      setCurrentTab('bun');
      return;
    }

    if (mainsInView) {
      setCurrentTab('main');
      return;
    }

    if (saucesInView) {
      setCurrentTab('sauce');
    }
  }, [bunsInView, mainsInView, saucesInView]);

  const sectionRefs: Record<TTabMode, React.RefObject<HTMLHeadingElement>> = {
    bun: titleBunRef,
    main: titleMainRef,
    sauce: titleSauceRef
  };

  const handleTabChange = (tab: string) => {
    const nextTab = tab as TTabMode;

    setCurrentTab(nextTab);
    sectionRefs[nextTab].current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSauceRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={handleTabChange}
    />
  );
};
