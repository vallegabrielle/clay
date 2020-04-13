/**
 * SPDX-FileCopyrightText: © 2020 Liferay, Inc. <https://liferay.com>
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {ClayButtonWithIcon} from '@clayui/button';
import ClayDropDown from '@clayui/drop-down';
import ClayForm, {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import React from 'react';

interface IItem {
	label: string;
	symbol: string;
}

interface ITranslations {
	[key: string]: string;
}

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	/**
	 * Labels for the aria attributes
	 */
	ariaLabels?: {
		default: string;
		openLocalizations: string;
		translated: string;
		untranslated: string;
	};

	/**
	 * Add informational text at the top of Localized Input.
	 */
	helpText?: React.ReactText;

	/**
	 * Label of the input
	 */
	label?: React.ReactText;

	/**
	 * Content to be prepended in case you want to localize a URL.
	 */
	prependContent?: React.ReactText;

	/**
	 * List of locales to allow localization for
	 */
	locales: Array<IItem>;

	/**
	 * Callback that gets called when a selected locale gets changed
	 */
	onSelectedLocaleChange: (val: IItem) => void;

	/**
	 * Callback that gets called when a translation of the selected locale gets changed
	 */
	onTranslationsChange: (val: ITranslations) => void;

	/**
	 * Allows specifying custom formatter, for example for formatting URLs, to be output after translating
	 */
	resultFormatter?: (val: string) => React.ReactNode;

	/**
	 * Exposes the currently selected locale
	 */
	selectedLocale: IItem;

	/**
	 * Path to the location of the spritemap resource.
	 */
	spritemap?: string;

	/**
	 * Translations provided to the component to be used and modified by it
	 */
	translations: ITranslations;
}

const ClayLocalizedInput = React.forwardRef<HTMLInputElement, IProps>(
	(
		{
			ariaLabels = {
				default: 'Default',
				openLocalizations: 'Open Localizations',
				translated: 'Translated',
				untranslated: 'Unstranslated',
			},
			helpText,
			id,
			label = 'Check for translations',
			locales,
			onSelectedLocaleChange,
			onTranslationsChange,
			placeholder = 'Text to translate...',
			prependContent,
			resultFormatter = val => val,
			selectedLocale,
			spritemap,
			translations,
			...otherProps
		}: IProps,
		ref
	) => {
		const [active, setActive] = React.useState(false);

		const defaultLanguage = locales[0];

		return (
			<ClayForm.Group>
				{label && <label htmlFor={id}>{label}</label>}

				{helpText && <ClayForm.Text>{helpText}</ClayForm.Text>}

				<ClayInput.Group>
					{prependContent && (
						<ClayInput.GroupItem prepend shrink>
							<ClayInput.GroupText>
								{prependContent}
							</ClayInput.GroupText>
						</ClayInput.GroupItem>
					)}

					<ClayInput.GroupItem>
						<ClayInput
							{...otherProps}
							id={id}
							onChange={e => {
								onTranslationsChange({
									...translations,
									[selectedLocale.label]: e.target.value,
								});
							}}
							placeholder={placeholder}
							ref={ref}
							value={translations[selectedLocale.label] || ''}
						/>
					</ClayInput.GroupItem>

					<ClayInput.GroupItem shrink>
						<ClayDropDown
							active={active}
							hasRightSymbols
							onActiveChange={setActive}
							trigger={
								<ClayButtonWithIcon
									displayType="unstyled"
									onClick={() => setActive(!active)}
									spritemap={spritemap}
									symbol={selectedLocale.symbol}
									title={ariaLabels.openLocalizations}
								/>
							}
						>
							<ClayDropDown.ItemList>
								{locales.map(locale => {
									const value = translations[locale.label];

									return (
										<ClayDropDown.Item
											key={locale.label}
											onClick={() =>
												onSelectedLocaleChange(locale)
											}
										>
											<ClayIcon
												className="inline-item inline-item-before"
												spritemap={spritemap}
												symbol={locale.symbol}
											/>

											{locale.label}

											<ClayLabel
												className="dropdown-item-indicator-end"
												displayType={
													locale.label ===
													defaultLanguage.label
														? 'info'
														: value
														? 'success'
														: 'warning'
												}
											>
												{locale.label ===
												defaultLanguage.label
													? ariaLabels.default
													: value
													? ariaLabels.translated
													: ariaLabels.untranslated}
											</ClayLabel>
										</ClayDropDown.Item>
									);
								})}
							</ClayDropDown.ItemList>
						</ClayDropDown>
					</ClayInput.GroupItem>
				</ClayInput.Group>

				<ClayForm.Text>
					{resultFormatter(translations[defaultLanguage.label])}
				</ClayForm.Text>
			</ClayForm.Group>
		);
	}
);

export default ClayLocalizedInput;
