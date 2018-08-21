from pathlib import Path

from setuptools import setup

readme = Path(__file__).parent.joinpath('README.md')
if readme.exists():
    with readme.open() as f:
        long_description = f.read()
else:
    long_description = '-'

setup(
    name='<%= packageName %>',
    version='0.1.0',
    description='<%= packageDesc %>',
    long_description=long_description,
    python_requires='>=3.6',
    packages=[
        '<%= packageName %>',
    ],
    author='<%= fullName %>',
    author_email='<%= email %>',
    url='',
    license='MIT',
    install_requires=[],
)
